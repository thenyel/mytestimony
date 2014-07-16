// @todo separate client side architecture into core/hub/modules
var MYT = MYT || {};  // defines MYT namespace

(function(){

    // @todo Form module inside sidebar module
    var Form = {
        init: function() {
            console.log('initing');
        }
    };


  /**
   * Delegate event handler to process button clicks
   * 
   * @name testimoniesClick
   * @param {Object} e - event object
   * @returns void - opens testimony detail page
   * @method 
   * @author Ryan Regalado 
   */
  function testimoniesClick(e) {
    var e = e || window.event; // IE doesn't pass in the event object
    e.preventDefault();

    if (e.target.nodeName !== "BUTTON") {
      return false;
    }

    var btnId    = e.target.getAttribute('id')
      , location = window.location
      , origin   = location.origin
      ;

    window.location.href = origin + '/testimonies/' + btnId;
  }



  /**
   * Kick of the app's lifecycle
   * 
   * @name init
   * @returns void - Sets up event listeners
   * @method 
   * @author Ryan Regalado 
   */
  function init(options) {
    var options = options || {};
    
    // @todo this is a bit overboard. We know this specific application has targeted IDs
    //       so this can be removed and just look for this. Can save internal reference
    //       in a config object for quick look up like:
    //
    //       defaults = {
    //          closeId: 'close'
    //          , openId: 'start'
    //          ...
    //       };
    var d              = window.document
      , closeId        = options.closeId       || 'close'
      , openId         = options.openId        || 'start'
      , submitId       = options.submitId      || 'submit-button'
      , tagsTemplate   = options.tagsTemplate  || ''
      , viewTesClass   = options.viewTesClass  || ''
      , testimoniesId  = options.testimoniesId || ''
      , testimonies    = d.getElementById(testimoniesId)
      , viewTesButtons = d.getElementsByClassName(viewTesClass)
      , viewLen        = viewTesButtons.length
      , i              = 0
      ;

    // set up obj attributes to call from functions within the application
    this.attributes = {};
    this.attributes.editorBarId          = options.editorBarId          || '';
    this.attributes.editorBoxId          = options.editorBoxId          || '';
    this.attributes.formId               = options.formId               || '';
    this.attributes.formContainerId      = options.formContainerId      || '';
    this.attributes.hiddenTestimonyBoxId = options.hiddenTestimonyBoxId || '';
    this.attributes.submitId             = options.formContainerId      || '';
    this.attributes.tagSingleContainerId = options.tagSingleContainerId || '';
    this.attributes.tagSingleId          = options.tagSingleId          || '';
    this.attributes.tagsInputId          = options.tagsInputId          || '';
    this.attributes.tagsBoxId            = options.tagsBoxId            || '';
    this.attributes.tagsTemplate         = options.tagsTemplate         || '';
    this.attributes.tagsDropDownId       = options.tagsDropDownId       || 'tag-category';
    this.attributes.testimonyBoxId       = options.testimonyBoxId       || '';
    this.attributes.titleId              = options.titleId              || '';

    // Set up click handlers
    if (testimonies) {
      testimonies.addEventListener('click', testimoniesClick, false);
    }


    MYT.modules.sidebar.init();
  }

  // API
  MYT = {
    init: init,
    Form: Form
  };

  return MYT;

}());

// for node require and testing
var module = module || {};
module.exports = MYT;
