/** @class Global variable & method Class
* @auther EnterKey
* @version 1
* @description 각 클래스에서 공통적으로 사용할 만한 메소드와 변수를 저장하는 클래스
*/
var Common = Class.extend({
  isUsableElement : function(element) {
    return typeof element != 'undefined' ? true : false;
  }
});

$(document).ready(function() {
    var documentAppController = new DocumentAppController();
    var editorAppController = new EditorAppController();
});
