(function () {
    'use strict';

    function serverSettingsController($scope, $routeParams, $timeout, 
        $rootScope,
        navigationService, notificationsService,
        uSyncPublishService) {
        var vm = this;
        vm.loading = true;
        vm.picker = false;

        vm.applyTemplate = applyTemplate;

        vm.buttonState = 'init';
        vm.checkStatus = 'init';
        vm.checkStatusButton = 'check access';

        vm.status = {};
        vm.server = {
            Id: '',
            SendSettings: { groups: 'admin,editor' },
            Icon: 'icon-server'
        };

        vm.checked = false;

        vm.page = {
            title: 'server name',
            description: 'server description'
        };

        vm.save = saveServer;
        vm.checkServer = checkServer;

        $timeout(function () {
            navigationService.syncTree({ tree: "uSyncPublisher", path: vm.alias });
        });

        $rootScope.$on('$routeUpdate', function (event, next) {
            Init();
        });

        Init();



        function Init() {

            vm.alias = $routeParams.id;
            if (vm.alias !== '-1') {
                loadServer();
            }
            else {
                // create 
                vm.picker = true;
                vm.loading = false;
            }
        }

        ////////////////

        function loadServer() {
            uSyncPublishService.getServer(vm.alias)
                .then(function (result) {
                    vm.server = result.data;
                    vm.loading = false;
                    vm.groups = vm.server.SendSettings.Groups.toString();
                }, function (error) {
                    notificationsService.error('error', error.data.ExceptionMessage);
                });
        }

        function saveServer() {

            vm.server.SendSettings.Groups = vm.groups.split(',');

            vm.saved = false;
            vm.buttonState = 'busy';
            uSyncPublishService.saveServer(vm.server)
                .then(function (result) {
                    vm.buttonState = 'success';
                    notificationsService.success('saved', 'server settings updated');
                    navigationService.syncTree({ tree: 'uSyncPublisher', path: ["-1", vm.server.Alias], forceReload: true });
                    vm.saved = true;
                    vm.checked = false;
                }, function (error) {
                    vm.buttonState = 'error';
                    notificationsService.error('error', error.data.ExceptionMessage);
                });
        }

        function checkServer() {
            vm.checked = true;
            vm.checkStatus = 'busy';
            vm.status = {};
            uSyncPublishService.checkServer(vm.server.Alias)
                .then(function (result) {
                    vm.checkStatus = 'success';
                    vm.checkStatusButton = result.data.Status;
                    vm.status = result.data;
                    vm.saved = false;

                    $timeout(() => {
                        vm.status = {};
                        vm.checked = false;
                    }, 2000);

                }, function (error) {
                    notificationsService.error('error', error.data.ExceptionMessage);
                });
        }

        function applyTemplate(template) {

            vm.server = {
                Icon: template.icon,
                Enabled: true,
                PullEnabled: true,
                Url: '[https://my.server.url/umbraco]',
                SendSettings: template.flags
            };
            vm.groups = template.groups;

            vm.picker = false; 
        }


        // templates (when you pick create )
        vm.templates = [
            {
                icon: 'icon-lab color-deep-purple',
                heading: 'Complete Sync',
                subHeading: 'All Options',
                description: 'Sync everything and let the user choose what to include in the dialog',
                flags: {
                    IncludeChildren: 'user-yes',
                    IncludeMedia: 'user-yes',
                    DeleteMissing: 'user-yes',
                    IncludeDependencies: 'user-yes',
                    IncludeFiles: 'user-yes',
                    IncludeAncestors: 'no',
                    IncludeLinked: 'no'
                },
                groups: 'admin,editor'
            },
            {
                icon: 'icon-server color-orange',
                heading: 'Full Sync',
                subHeading: 'Choose Content & Media',
                description: 'Send everything and let the user choose what Content and Media to include',
                flags: {
                    IncludeChildren: 'user-yes',
                    IncludeMedia: 'user-yes',
                    DeleteMissing: 'user-yes',
                    IncludeDependencies: 'yes',
                    IncludeFiles: 'yes',
                    IncludeAncestors: 'no',
                    IncludeLinked: 'no'
                },
                groups: 'admin,editor'
            },
            {
                icon: 'icon-server color-green',
                heading: 'Full Sync',
                subHeading: 'Minimal Choice',
                description: 'Send Everything as part of the process, but only let the user pick include children',
                flags: {
                    IncludeChildren: 'user-yes',
                    IncludeMedia: 'yes',
                    DeleteMissing: 'user-yes',
                    IncludeDependencies: 'yes',
                    IncludeFiles: 'yes',
                    IncludeAncestors: 'no',
                    IncludeLinked: 'no'
                },
                groups: 'admin,editor'
            },
            {
                icon: 'icon-infinity color-orange',
                heading: 'Deployed Sync',
                subHeading: 'Choose Content & Media',
                description: 'Settings are already synced by your deployment process. User can choose content and media',
                flags: {
                    IncludeChildren: 'user-yes',
                    IncludeMedia: 'user-yes',
                    DeleteMissing: 'user-yes',
                    IncludeDependencies: 'no',
                    IncludeFiles: 'no',
                    IncludeAncestors: 'no',
                    IncludeLinked: 'no'
                },
                groups: 'admin,editor'
            },
            {
                icon: 'icon-infinity color-green',
                heading: 'Deployed Sync',
                subHeading: 'Minimal Choice',
                description: 'Settings are already synced by your deployment process. Minimal user choices',
                flags: {
                    IncludeChildren: 'user-yes',
                    IncludeMedia: 'no',
                    DeleteMissing: 'user-yes',
                    IncludeDependencies: 'no',
                    IncludeFiles: 'no',
                    IncludeAncestors: 'no',
                    IncludeLinked: 'no'
                },
                groups: 'admin,editor'
            },
            {
                icon: 'icon-sunny color-purple',
                heading: 'Blank',
                subHeading: 'Clean Template',
                description: 'Blank template, no settings already set, choose your own settings',
                flags: {
                    IncludeChildren: 'no',
                    IncludeMedia: 'no',
                    DeleteMissing: 'no',
                    IncludeDependencies: 'no',
                    IncludeFiles: 'no',
                    IncludeAncestors: 'no',
                    IncludeLinked: 'no'
                },
                groups: 'admin,editor'
            }
        ];

    }

    angular.module('umbraco')
        .controller('uSyncPublisherServerSettingsController', serverSettingsController);
})();