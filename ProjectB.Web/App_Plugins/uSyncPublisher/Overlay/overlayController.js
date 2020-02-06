(function () {
    'use strict';

    function overlayController($scope, $q,
        uSyncHub,
        uSyncPublishService,
        uSyncPublisherService,
        notificationsService) {

        var vm = this;
        vm.servers = [];
        vm.loading = true;
        vm.pickServer = true;
        vm.working = false;

        vm.onSelected = onSelected;
        vm.mode = 'push';
        vm.servers = $scope.model.servers;
        vm.content = $scope.model.entity;
        vm.complete = false;
        vm.contentIsDirty = false;

        $scope.model.moveToNext = moveToNext;
        $scope.model.isComplete = isComplete;

        vm.servers = [{ Name: 'loading', Icon: 'icon-timer' }]

        vm.actionNo = -1;
        vm.message = {
            Steps: [],
            Message: 'working'
        };

        vm.processId = '00000000-0000-0000-0000-000000000000';

        vm.stepArgs = {
            stepAlias: '',
            target: '',
            options: '',
            clientId: ''
        };

        vm.servers = [];
        vm.flags = {
            includeChildren: { toggle: true, value: true },
            includeMedia: { toggle: true, value: true },
            includeLinked: { toggle: true, value: false },
            includeAncestors: { toggle: false, value: false },
            includeDependencies: { toggle: false, value: false },
            includeFiles: { toggle: false, value: false },
            includeMediaFiles: { toggle: true, value: false },
            deleteMissing: { toggle: true, value: false }
        };

        vm.calcPercentage = calcPercentage;
        vm.complete = false;

        $scope.$watch('vm.complete', function (newVal, oldVal) {
            if (newVal === true) {
                $scope.model.submitButtonLabel = 'Done';
                $scope.model.hideSubmitButton = true;
            }
        });

        ////////////

        function init() {
            $scope.model.disableSubmitButton = true;

            uSyncPublishService.getServers(vm.mode)
                .then(function (result) {
                    vm.servers = result.data;
                    checkServers(vm.servers);
                    vm.loading = false;
                });

            initHub();

            if (isDirty()) {
                vm.contentIsDirty = true;
            }
        }

        function isDirty() {
            for (let i = 0; i < vm.content.variants.length; i++) {
                if (vm.content.variants[i].isDirty === true) {
                    return true;
                }
            }
            return false;
        }

        /// server checks.
        function checkServers(servers) {
            servers.forEach(function (server) {
                uSyncPublishService.checkServer(server.Alias)
                    .then(function (result) {
                        server.status = result.data;
                    });
            });
        }

        function onSelected(server) {
            $scope.model.server = server;

            vm.selectedServer = server;

            $scope.model.disableSubmitButton = false;
            vm.stepArgs.target = server.Alias;
        }

        ///// toggles 
        function prepToggles(server) {

            var op = server.SendSettings;
            if (op !== undefined) {
                vm.flags.includeAncestors = setToggle(op.IncludeAncestors);
                vm.flags.includeChildren = setToggle(op.IncludeChildren);
                vm.flags.includeDependencies = setToggle(op.IncludeDependencies);
                vm.flags.includeFiles = setToggle(op.IncludeFiles);
                vm.flags.includeLinked = setToggle(op.IncludeLinked);
                vm.flags.includeMedia = setToggle(op.IncludeMedia);
                vm.flags.deleteMissing = setToggle(op.DeleteMissing);

                // override the settings for media 
                if (vm.isMedia) {
                    vm.flags.includeMedia = { toggle: false, value: true };
                    vm.flags.includeAncestors = { toggle: false, value: true };
                    vm.flags.includeFiles = { toggle: false, value: false };
                    vm.flags.includeLinked = { toggle: false, value: false };
                }
            }
        }

        function setToggle(value) {
            if (value !== undefined && value.startsWith('user')) {
                return { toggle: true, value: value.endsWith('yes') };
            }
            else {
                return { toggle: false, value: value === 'yes' };
            }
        }


        ///// actions

        function loadActions() {
            vm.loadedActions = false;

            uSyncPublisherService.getActions(vm.mode, vm.selectedServer.Alias)
                .then(function (result) {
                    vm.actions = result.data;
                    vm.actionNo = 0;
                    vm.loadedActions = true;
                    setupAction(vm.actionNo);
                    vm.pickServer = false;
                }, function (error) {
                    notificationsService.error('Error', error.data.ExceptionMessage);
                    vm.actionButton.state = 'error';
                    vm.working = false;
                });
        }

        function setupAction(actionNo) {

            var current = vm.actions[actionNo];

            $scope.model.title = current.Name;

            // init the message display.
            vm.message.title = current.Name;
            vm.message.Steps = current.Steps;
            vm.stepArgs.stepAlias = current.Alias;

            if (current.View !== null && current.View.length > 0) {
                // user UI step.
                showActionView(current);
            }
            else {
                // automatic step.
                vm.view = { show: false };
                performAction();
            }
        }

        function showActionView(action) {
            vm.working = false;
            vm.view = {
                show: true,
                path: action.View
            };

            $scope.model.submitButtonLabel = action.ButtonText;
        }

        function performAction() {

            vm.working = true;
            $scope.model.submitButtonState = 'busy';
            vm.stepArgs.clientId = getClientId();

            uSyncPublisherService.performAction(vm.processId, vm.mode, vm.stepArgs)
                .then(function (result) {
                    vm.results = result.data;

                    if (vm.results.Success) {

                        if (vm.processId === '00000000-0000-0000-0000-000000000000') {
                            vm.processId = vm.results.Id;
                        }

                        // is this the end. 
                        vm.complete = vm.results.Complete;

                        // next step 
                        if (!vm.complete) {
                            nextAction();
                        }
                        else {
                            vm.working = false;
                        }
                        $scope.model.submitButtonState = 'success';
                    }
                    else {
                        notificationsService.error('Failed', 'There was a problem running this step');
                        $scope.model.submitButtonState = 'error';
                        vm.working = false;
                    }
                }, function (error) {
                    notificationsService.error('Error', error.data.ExceptionMessage);
                    $scope.model.submitButtonState = 'error';
                    vm.working = false;
                });
        }

        function nextAction() {
            if (vm.actionNo < vm.actions.length) {
                vm.actionNo++;
                setupAction(vm.actionNo);
            }
        }

        // called in by overlay 
        function moveToNext() {

            if (vm.actionNo == -1) {
                prepToggles(vm.selectedServer);
                loadActions();
            }
            else {
                nextAction();
            }
        }

        function isComplete() {
            return vm.complete;
        }

        function calcPercentage(status) {
            if (status !== undefined) {
                return (100 * status.Count) / status.Total;
            }
            return 1;
        }

        ////// SignalR things 
        function initHub() {
            uSyncHub.initHub(function (hub) {
                vm.hub = hub;

                vm.hub.on('update', function (update) {
                    vm.update = update;
                });

                vm.hub.on('add', function (status) {
                    vm.status = status;
                });

                vm.hub.on('publisher', function (message) {
                    vm.message = message;
                });

                vm.hub.start();
            });
        }

        function getClientId() {
            if ($.connection !== undefined && $.connection.hub !== undefined) {
                return $.connection.hub.id;
            }
            return "";
        }


        init();
    };

    angular.module('umbraco')
        .controller('uSyncPublishOverlayController', overlayController);
})();