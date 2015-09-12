angular.module('infoChunk', []).directive('infoChunk', function() {
    return {
        restrict: 'E',
        scope: { data: '=' },
        template: '<h4 class="lead text-justify"><strong ng-bind-html="data.sectionHeader"></strong></h4> ' +

        '<div ng-if="data.paragraphs.length > 0"> ' +
        '<p class="lead text-justify" ng-repeat="p in data.paragraphs track by $index" ng-bind-html="p" ' +
        'ng-show="!(data.numParagraphsBeforeList !== undefined && data.numParagraphsBeforeList <= data.paragraphs.length && ' +
        'data.numParagraphsBeforeList > -1) || $index < data.numParagraphsBeforeList"></p> ' +
        '</div> ' +

        '<ul ng-show="data.list.length > 0" ng-class="data.listClass"> ' +
        '<li ng-repeat="l in data.list track by $index" ng-bind-html="l"></li> ' +
        '</ul> ' +

        '<div ng-if="data.paragraphs.length > 0 && (data.numParagraphsBeforeList !== undefined && ' +
        'data.numParagraphsBeforeList <= data.paragraphs.length && data.numParagraphsBeforeList > -1)"> ' +
        '<p class="lead text-justify" ng-repeat="p in data.paragraphs track by $index" ng-bind-html="p" ' +
        'ng-show="!(data.numParagraphsBeforeList !== undefined && data.numParagraphsBeforeList <= data.paragraphs.length && ' +
        'data.numParagraphsBeforeList > -1) || $index >= data.numParagraphsBeforeList"> ' +
        '</p> ' +
        '</div><hr/>'
    };
});