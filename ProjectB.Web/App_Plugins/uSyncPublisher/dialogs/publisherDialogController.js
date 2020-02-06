(function () {
    'use strict';

    function publisherDialogController($scope, $q,
        contentResource,
        mediaResource,
        notificationsService,
        uSyncPublishService,
        uSyncPublisherService,
        uSyncHub) {

        var vm = this;

        vm.loading = true;
        vm.loadedActions = false; 
        vm.complete = false;
        vm.working = false;
        vm.valid = false;

        vm.mode = $scope.model.mode;

        vm.entity = $scope.model.entity;
        vm.isMedia = vm.entity.metaData.application === 'media';
        vm.isSettings = vm.entity.metaData.application === 'settings';

        vm.view = {
            show: false,
            path: ''
        };

        vm.actionButton = {
            state: 'init',
            name: 'Send'
        };

        vm.dialog = {
            title: 'Select a Server',
            desc: vm.mode + ' ' + (vm.isMedia ? 'media' : 'content')
        };

        vm.message = {
            Steps: [],
            Message: 'working'
        };

        vm.processId = '00000000-0000-0000-0000-000000000000'; // this will be the guid.

        vm.stepArgs = {
            stepAlias: '',
            target: '',
            options: '',
            clientId: ''
        };

        vm.actionNo = 0;
        vm.pickServer = true;
        if (vm.entity.server !== undefined) {
            vm.pickServer = false;
            vm.selectedServer = vm.entity.server;
        }

        vm.content = {};

        /// function 
        vm.close = close;
        vm.performAction = performAction;
        vm.setValidState = setValidState;
        vm.calcPercentage = calcPercentage;

        // server and toggle prep.
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

        /// init 
        InitController();


        function InitController() {

            var promises = [];

            if (vm.entity.id * 1 === -1) {
                vm.content = {
                    id: vm.entity.id,
                    name: vm.isMedia ? 'Media' : 'Content',
                    variants: [{name: 'Content'}]
                };
            }
            else {
                if (!vm.isMedia) {
                    promises.push(contentResource.getById(vm.entity.id)
                        .then(function (content) {
                            vm.content = content;
                        }));
                }
                else {
                    promises.push(mediaResource.getById(vm.entity.id)
                        .then(function (content) {
                            vm.content = content;
                        }));
                }
            }

            if (vm.pickServer) {
                promises.push(uSyncPublishService.getServers(vm.mode)
                    .then(function (result) {
                        vm.servers = result.data;
                        checkServers(vm.servers);
                    }));
            }

            initHub();

            $q.all(promises).then(function () {
                if (!vm.pickServer) {
                    initDirectServer();
                }

                vm.loading = false;
            });

        }

        function loadActions() {
            vm.loadedActions = false;
            uSyncPublisherService.getActions(vm.mode, vm.selectedServer.Alias)
                .then(function (result) {
                    vm.actions = result.data;
                    vm.actionNo = 0;
                    vm.loadedActions = true;
                    setupAction(vm.actionNo);
                }, function (error) {
                    notificationsService.error('Error', error.data.ExceptionMessage);
                    vm.actionButton.state = 'error';
                    vm.working = false;
                });
        }


        ///////////

        function setupAction(actionNo) {

            var current = vm.actions[actionNo];

            // dialog title
            vm.dialog.title = current.Name;

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

            vm.actionButton.name = action.ButtonText;
        }

        function nextAction() {
            vm.pickServer = false;
            if (vm.actionNo < vm.actions.length) {
                vm.actionNo++;
                setupAction(vm.actionNo);
            }
        }

        /////////

        function close() {
            if (vm.processId !== '00000000-0000-0000-0000-000000000000') {
                clean(vm.processId, vm.selectedServer.Alias);
            } 

            if ($scope.model.close) {
                $scope.model.close();
            }
        }

        function clean(id, server) {
            uSyncPublisherService.clean(id, server)
                .then(function () {
                    // console.log('cleaned up our mess');
                });
        }

        // do the thing, 
        // do we need to get config etc from the included view?
        function performAction() {

            vm.working = true;
            vm.actionButton.state = 'busy';
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
                        vm.actionButton.state = 'success';
                    }
                    else {
                        notificationsService.error('Failed', 'There was a problem running this step');
                        vm.actionButton.state = 'error';
                        vm.working = false;
                    }
                }, function (error) {
                    notificationsService.error('Error', error.data.ExceptionMessage);
                    vm.actionButton.state = 'error';
                    vm.working = false;
                });
        }

        function setValidState(valid) {
            vm.valid = valid;
        }

        function calcPercentage(status) {
            if (status !== undefined) {
                return (100 * status.Count) / status.Total;
            }
            return 1;
        }

        ////// server picker 
        vm.onSelected = onSelected;

        ////////

        function checkServers(servers) {
            servers.forEach(function (server) {
                uSyncPublishService.checkServer(server.Alias)
                    .then(function (result) {
                        server.status = result.data;
                    });
            });
        }

        function onSelected(server) {
            vm.selectedServer = server;
            prepToggles(server);
            setValidState(true);
            vm.stepArgs.target = server.Alias;

            vm.dialog.desc = vm.mode + ' ' + (vm.isMedia ? 'media' : 'content') + ' to ' + vm.selectedServer.Name;

            loadActions();

            $scope.$broadcast('sync-server-selected', { server: server, flags: vm.flags });
        }

        /////// Toggles

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

        function initDirectServer() {
            vm.stepArgs.options = {
                items: vm.entity.items
            };
            onSelected(vm.selectedServer);
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


    }

    angular.module('umbraco')
        .controller('uSyncPublisherDialogController', publisherDialogController);

})();