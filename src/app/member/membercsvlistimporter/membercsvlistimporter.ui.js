(function () {
    angular
        .module('cdmf.member.csvlistimporter.ui', [
            'cdmf.hal',
            'cdmf.member',
            'cdmf.precheckmember',
            'ngFileUpload'
        ])
        .controller('MemberCsvListImporterController', MemberCsvListImporterController)
        .constant('MEMBER_UPLOAD_URL', '/management/member/preCheckMember/uploadMemberFile')
        .component('cdmfMemberCsvlistImporter', {
            templateUrl: 'app/member/membercsvlistimporter/membercsvlistimporter.html',
            controller: 'MemberCsvListImporterController',
            controllerAs: 'vm'
        });

    function MemberCsvListImporterController(
        $timeout,
        hal,
        MEMBER_UPLOAD_URL,
        PreCheckMember,
        Upload
    ) {
        var vm = this;
        var memberUploadUrl;

        hal.buildCompleteUrl(MEMBER_UPLOAD_URL).then(function (url){
            memberUploadUrl = url;
        });


        _.extend(vm, {
            publishPreCheckedMembersResult: null,
            errorMsg: undefined,
            errFile: undefined,
            file: undefined,
            preCheckId: undefined,
            preview_members: undefined
        });

        _.extend(vm, {
            publishPreCheckedMembers: publishPreCheckedMembers,
            uploadFiles: uploadFiles
        });

        function publishPreCheckedMembers() {
            if (vm.preCheckId > 0) {

                PreCheckMember
                    .publish(vm.preCheckId)
                    .then(function (publishPreCheckedMembersResult) {
                        vm.publishPreCheckedMembersResult = publishPreCheckedMembersResult;
                        vm.preview_members = null;
                        vm.errFile = null;
                        vm.file = null;
                        vm.preCheckId = null;

                        //TODO Automatic reload of members after update
                        // getAllMembers();
                    });
            }
        }

        function uploadFiles(file, errFiles) {
            vm.publishPreCheckedMembersResult = null;
            vm.file = file;
            vm.errFile = errFiles && errFiles[0];

            if (file) {
                //Create upload function
                file.upload = Upload.upload({
                    url: memberUploadUrl,
                    data: {
                        file: file
                    }
                });

                //Execute upload funtction asyncronously
                file.upload.then(
                    //On success result = response
                    function (response) {
                        //Inner funtion will be called after time out
                        $timeout(function () {
                            file.result = response.data;

                            vm.preCheckId = response.data.preCheckId;

                            PreCheckMember
                                .getById(vm.preCheckId)
                                .then(function (preview_members) {
                                    vm.preview_members = preview_members;
                                });
                        });
                    },
                    //On error callback
                    function (response) {
                        if (response.status > 0)
                            vm.errorMsg = response.status + ': ' + response.data;
                    },
                    // Event notification callback 0 or more times
                    function (evt) {
                        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
                    });
            }
        }
    }
})();