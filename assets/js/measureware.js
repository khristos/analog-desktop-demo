/*!
 * measureware v0.0.1
 * MeasureWARE project.
 * (c) 2019 ADI
 * ADI License
 * https://bitbucket.analog.com
 */

/**
 * @file: measureware.js
 */

//console.log('measureware.js file loaded');

// Global Measureware object
var MW = ADI.Measureware = {};





/**
 * 
 * @file: mw-carousel-product.js
 * 
 */

 //t.Core = function() {
MW.productCarouselSynced = (function() {
  var init = function() {

    var $sync1 = $('#mw-productCarousel__slider--pdp01');
    var $sync2 = $('#mw-productCarousel__thumbnails--pdp01');
    var sync2 = '#mw-productCarousel__thumbnails--pdp01'
    //var slidesPerPage = 4; //globaly define number of elements per page
    var slidesPerPage = document.querySelectorAll(sync2 + ' .mw-productCarousel__thumbnailItem').length; //globaly define number of elements per page
    var syncedSecondary = true;

    if (typeof $sync1.owlCarousel !== 'function') { 
      return;
    }

    $sync1.owlCarousel({
      loop: false,
      margin: 10,
      nav: false,
      callbacks: true,
      info: true,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 1
        },
        1000: {
          items: 1
        }
      },
      singleItem: true
    });


    $sync2.owlCarousel({
      items: slidesPerPage,
      margin: 0,
      nav: true,
      navText: ['<img src="./assets/svg/icons/icon--arrow-previous_u2533.svg" alt="Previous Slide" class="" />','<img src="./assets/svg/icons/icon--arrow-next_u2533.svg" alt="Next Slide" class="" />'],
      slideBy: slidesPerPage,
      //callbacks: true,
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 4
        },
        1000: {
          items: 4
        }
      }
    });

    $sync1.on('changed.owl.carousel', syncPosition);

    $sync2.on('initialized.owl.carousel', (function () {
      $sync2.find(".owl-item").eq(0).addClass("current");
    }));
    $sync2.on('changed.owl.carousel', syncPosition2);

    function syncPosition(el) {
      //if you set loop to false, you have to restore this next line
      var current = el.item.index;
      
      //if you disable loop you have to comment this block
      /*
      var count = el.item.count-1;
      var current = Math.round(el.item.index - (el.item.count/2) - .5);
      
      if(current < 0) {
        current = count;
      }
      if(current > count) {
        current = 0;
      }
      */
      //end block

      $sync2
        .find(".owl-item")
        .removeClass("current")
        .eq(current)
        .addClass("current");
      var onscreen = $sync2.find('.owl-item.active').length - 1;
      var start = $sync2.find('.owl-item.active').first().index();
      var end = $sync2.find('.owl-item.active').last().index();
      
      if (current > end) {
        $sync2.data('owl.carousel').to(current, 100, true);
        //$sync2.trigger("owl.goTo", current);
      }
      if (current < start) {
        $sync2.data('owl.carousel').to(current - onscreen, 100, true);
        //$sync2.trigger("owl.goTo", current - onscreen);
      }
    }

    function syncPosition2(el) {
      if (syncedSecondary) {
        var number = el.item.index;
        $sync1.data('owl.carousel').to(number, 100, true);
        //$sync1.trigger("owl.goTo", number);
      }
    }

    $sync2.on("click", ".owl-item", (function(e) {
      e.preventDefault();
      var number = $(this).index();
      $sync1.data('owl.carousel').to(number, 300, true);
      //$sync1.trigger("owl.goTo", number);
    }));

    /*$sync2.on("click", ".owl-item", function(e) {
      e.preventDefault();
      var number = $(this).data("owlItem");
      $sync1.trigger("owl.goTo", number);
    });*/

    // Insert zoom icon in correct DOM location without breaking Owl slider.
    //var controlZoom = '<a class="zoom modal-control"><img src="https://www.analog.com/lib/img/products/details/icon-zoom.svg" alt=""></a>';

    /*$('.mw-productCarousel__slider.js-mw-zoom').each(function() {
      $(this).find('zoom modal-control');
      $(this).after(controlZoom);
    });*/
  }

  return {
    init: init
  };

})(window.ADI = window.ADI || {}, jQuery, window);


$(document).ready((function() {
  MW.productCarouselSynced.init();
}));


//Linked OwlCarousel instances
//https://www.codeseek.co/washaweb/owl-carousel-2-sync-demo-with-loopautoplay-KVRxRW
//http://merritt-wellness.com/demos/sync.html
//https://www.codeseek.co/preview/KVRxRW
//https://github.com/OwlCarousel2/OwlCarousel2/issues/1378
//https://github.com/OwlCarousel2/OwlCarousel2/issues/80
//http://jsbin.com/dezag/1/edit
//https://jsbin.com/loqihoqa/21/edit?html,js
//http://www.fepsearchgroup.com/demos/sync.html

/**
 * @name Cart
 * @object
 * @description Collection of methods pertaining to an order session
 */
MW.Cart = {

    /**
     * @name add
     * @method
     * @description Adds the provided product to the cart
     * @param {Object} product 
     */
    add: function( product ){
        var cart = this.get(),
        prod = Object.assign({}, product );

        if( this.includes( prod.productID ) ){
            var existing = this.get( prod.productID );
            existing.product.productQuantity += 1;
            cart.splice( existing.index, 1, existing.product );
        } else {
            prod.productQuantity = 1;
            cart.push( prod );
        }
        this.set( cart );
    },

    /**
     * @name empty
     * @method
     * @description Empties the current cart
     */
    empty: function(){
        localStorage.removeItem( this.name );
    },

    /**
     * @name get
     * @method
     * @description Retrieves list of products in the current cart
     * @param {string} [id] If provided, returns the item in the cart with a matching ID
     * @returns {array|[null|Object]} Array of products in the current user order. If an ID is provided, returns either the Object in the cart, or `null`
     */
    get: function( id ){
        var data = localStorage.getItem( this.name );
        if( !data ) return [];
        data = JSON.parse( data );
        if( !id ) return data;
        for( var i = 0; i < data.length; ++i ){
            if( data[ i ].productID !== id ) continue;
            return {
                product: data[ i ],
                index: i
            };
        }
        return null;
    },

    /**
     * @name getDetails
     * @method
     * @description Retrieves part details from DigiKey
     * @param {function} callback Action to execute when the requests have finished
     */
    getDetails: function( callback ){
        var cart = this.get(),
        products = cart.map((function( product ){
            return product.productID;
        }));

        jQuery
            .getJSON( ADI.Config.digiKeyPartDetails, { products: products.join( ',' ) })
            .done((function( res ){
                console.log( 'Finish updating part details', res );
                callback();
            }))
            .fail((function( err ){
                console.error( err );
                callback();
            }));

    },

    /**
     * @name includes
     * @method
     * @description Determines if a product is in the cart
     * @param {string} id ID of the product to test
     * @returns {boolean} `true` if product is in the cart, `false` if not
     */
    includes: function( id ){
        var cart = this.get(),
        index = -1;
        for( var i = 0; i < cart.length; ++i ){
            if( cart[ i ].productID === id ) index = i;
        }
        return ( index > -1 );
    },

    /**
     * @name name
     * @string
     * @description Name of the local storage item that the cart is stored in
     */
    name: 'mwOrder',

    /**
     * @name remove
     * @method
     * @description Removes an item from the cart
     * @param {string} id ID of the product to remove
     */
    remove: function( id ){
        var cart = this.get();

        if( !this.includes( id ) ) return console.info( 'Cannot remove. Item, "' + id + '", not in cart.' );

        for( var i = 0; i < cart.length; ++i ){
            if( cart[ i ].productID === id ) cart.splice( i, 1 );
        }
        
        this.set( cart );
    },

    /**
     * @name set
     * @method
     * @description Sets the value of the cart
     * @param {Object|string} cart 
     */
    set: function( cart ){
        localStorage.setItem( this.name, typeof cart === 'string' ? cart : JSON.stringify( cart ) );
    },

    /**
     * @name summary
     * @method
     * @description Yields the subtotal for all the items in the cart
     * @returns {number} Subtotal
     */
    summary: function(){

        var cart = this.get(),
        subtotal = 0,
        totalQty = 0;

        cart.forEach((function( product ){
            subtotal += ( product.productPrice * product.productQuantity );
            totalQty += product.productQuantity;
        }));

        subtotal = parseFloat( Math.round( subtotal * 100 ) / 100 ).toFixed( 2 );

        return { subtotal: subtotal, totalQty: totalQty };
    },

    /**
     * @name update
     * @method
     * @description Updates the quantity of the provided product ID
     * @param {string} id ID of the product whose quantity is being update
     * @param {number} quantity Quantity to update the cart item with
     */
    update: function( id, quantity ){
        var cart = this.get(),
        data = this.get( id );
        if( !data ) return console.info( 'Cannot update. Item, "' + id + '", not in cart.' );
        if( quantity < 1 ) return this.remove( id );
        data.product.productQuantity = quantity;
        cart.splice( data.index, 1, data.product );
        this.set( cart );
    }

};
/**
 * 
 * @file: mw-hb-helpers.js
 * 
 */

//t.Core = function() {
MW.registerHB = (function() {
  var i = this;
  var init = function() {

    //this.registerHandlebarsHelper = function() {
    i.registerHandlebarsHelper = function() {
      Handlebars.registerHelper('checkPCNPDN', (function(o1, o2, options) {
          var hasPCN = false,
              hasPDN = false;
          if (o1 != null && o1.length > 0) hasPCN = true;
          if (o2 != null && o2.length > 0) hasPDN = true;
          if (hasPCN || hasPDN) {
              return options.fn(this);
          } else {
              return options.inverse(this);
          }
      }));
      Handlebars.registerHelper('getPCNLabel', (function(o1, a, b) {
          var label,
              hasPCN = false,
              hasPDN = false;
          if (o1.PCNPDNInfoModelList.length > 0) hasPCN = true;
          if (o1.PDNInfoModelList.length > 0) hasPDN = true;
          if (hasPCN && !hasPDN) label = a;
          else if (!hasPCN && hasPDN) label = b;
          else if (hasPCN && hasPDN) label = a + "/" + b;
          return label;
      }));
      Handlebars.registerHelper('compare', (function(lvalue, operator, rvalue, options) {
          var operators, result;

          if (arguments.length < 3) {
              throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
          }

          if (options === undefined) {
              options = rvalue;
              rvalue = operator;
              operator = "===";
          }

          operators = {
              '==': function(l, r) {
                  return l == r;
              },
              '===': function(l, r) {
                  return l === r;
              },
              '!=': function(l, r) {
                  return l != r;
              },
              '!==': function(l, r) {
                  return l !== r;
              },
              '<': function(l, r) {
                  return l < r;
              },
              '>': function(l, r) {
                  return l > r;
              },
              '<=': function(l, r) {
                  return l <= r;
              },
              '>=': function(l, r) {
                  return l >= r;
              },
              'typeof': function(l, r) {
                  return typeof l == r;
              }
          };

          if (!operators[operator]) {
              throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + operator);
          }

          result = operators[operator](lvalue, rvalue);

          if (result) {
              return options.fn(this);
          } else {
              return options.inverse(this);
          }
      }));
      Handlebars.registerHelper('ifCond', (function(v1, v2, options) {
          if (v1 === v2) {
              return options.fn(this);
          }
          return options.inverse(this);
      }));
      Handlebars.registerHelper('toFixedDecimal', (function(number) {
          return parseFloat(Math.round(number * 100) / 100).toFixed(2);
      }));
      Handlebars.registerHelper('formatDate', (function(date, format) {
          try {
              return moment(date).format(format);
          } catch (err) {
              return date;
          }
      }));

      Handlebars.registerHelper('getHTML', (function(data) {
          return new Handlebars.SafeString(data);
      }));
      Handlebars.registerHelper('authorList', (function (array, lang) {
          var len = array.length;
          var authors = '';
          for(i=0;i<len;i++)
          {
              if ( i == 0 ){
                  authors = array[i];
              } else if (i > 0 && i != len-1 ){
                  authors += ', ' + array[i];
              } else {
                  authors += ' and ' + array[i];
              }
          }
          return new Handlebars.SafeString(authors);
      }));
    };

    registerHandlebarsHelper();
  }

  return {
    init: init
  };

})(window.ADI = window.ADI || {}, jQuery, window);


$(document).ready((function() {
  if ( typeof Handlebars == 'undefined') {
    return;
  }
  MW.registerHB.init();
}));
//{{decimal price}}
/**
 * 
 * @file: mw-helper-template.js
 * 
 */

MW.Component = (function () {
  'use strict';

  //
  // Methods
  //

  /**
   * Create the Constructor object
   */
  var Constructor = function (elem, options) {
    if (!(this instanceof Constructor)) {
      throw new Error("Constructor needs to be called with the new keyword");
    }
    if (!elem) throw 'Constructor needs to be called with an element to make into a component.';
    this.elem = elem;
    this.data = options ? options.data : null;
    this.template = options ? options.template : null;
  };

  /**
   * Sanitize and encode all HTML in a user-submitted string
   * @param  {String} str  The submitted string
   * @return {String}      The sanitized string
   */
  Constructor.sanitize = function (str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  };

  /**
   * Render the template into the DOM
   * @return {[type]}          The element
   */
  Constructor.prototype.render = function () {
    // Make sure there's a template
    if (!this.template) throw 'mw-helper-template.js: No template was provided.';

    // If elem is an element, use it.
    // If it's a selector, get it.
    var elem = typeof this.elem === 'string' ? document.querySelector(this.elem) : this.elem;
    if (!elem) return;

    // Get the template
    var template = (typeof this.template === 'function' ? this.template(this.data) : this.template);
    if (['string', 'number'].indexOf(typeof template) === -1) return;

    // Render the template into the element
    if (elem.innerHTML === template) return;
    elem.innerHTML = template;

    // Dispatch a render event
    if (typeof window.CustomEvent === 'function') {
      var event = new CustomEvent('render', {
        bubbles: true,
        detail: this.data || {}
      });
      elem.dispatchEvent(event);
    }

    // Return the elem for use elsewhere
    return elem;
  };

  /**
   * Reactively update the data
   * @param {Object} obj The new data
   */
  Constructor.prototype.setData = function (obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        this.data[key] = obj[key];
      }
    }
    this.render();
  };

  /**
   * Get an immutable copy of the data
   */
  Constructor.prototype.getData = function () {
    return JSON.parse(JSON.stringify(this.data));
  };

  //
  // Return the Constructor
  //

  return Constructor;

})();
/**
 * 
 * @file: mw-plp-grid.js
 * 
 */

 //t.Core = function() {
MW.plpGrid = (function() {
  if ( typeof g_oIndividualProducts == 'undefined' ) {
    return;
  }

  var config = {
    // Selectors
    filterByCheckboxes: 'mw-buttonTag__checkbox__input',
    filterByTags: 'js-mw-filterByTags',
    filterByMeasurementClear: 'js-mw-filterBy__measurement--clear'
  }

  /*!
    * Sanitize and encode all HTML
    * @param  {String} str  The submitted string
    * @return {String} str  The sanitized string
    */
   MW.Component.sanitizeHTML = function (str) {
    var temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  };

  /**
   * Setup the new grid component
   */
  if ( typeof MW.Component == 'undefined' ) {
    return;
  }

  // Template instance to output user-selected criteria tags
  var criteriaFromUser = new MW.Component('#mw-filterBy__tags--selected', {
    data: {
      criteriaSelected: []
    },
    template: function (props) {
      var selected = props.criteriaSelected;
      var selectedHTML = '';

      // Save data to localStorage
      localStorage.setItem('criteriaSelected', JSON.stringify(props.criteriaSelected));

      // If there are no selected criteria yet
      if (props.criteriaSelected && props.criteriaSelected.length < 1) {
        //return '<p><em>Add a filter item or two below to get started.</em></p>';
        selectedHTML = '';
      }

      // Create HTML list criteria items
      var criteriaList = props.criteriaSelected.map((function (criteria, index) {
        var name = MW.Component.sanitizeHTML(criteria);
        return '<li class="mw-buttonTag__item">' + name + ' <button class="mw-buttonText mw-buttonText--primaryIcon mw-buttonText--xs" aria-label="Remove ' + name + '" data-criteria-item-selected="' + name + '" type="button">' + name +'<img src="./assets/svg/icons/icon--cancel_u149.svg" class="mw-buttonText__icon mw-buttonText__icon--right"</button></li>';
      }));

      if (props.criteriaSelected.length > 0) {
        selectedHTML += '<ul class="mw-buttonGroup--horizontal js-mw-filterBy__tags--selected" id="mw-filterBy__tags--selected">' + criteriaList.join('') + '</ul>';
      }

      // If there are selected 'criteria'
      if (selected) {
        //selected = '<p><strong>' + sanitizeHTML(props.criteriaSelected) +  ' is selected.</strong></p>';
      }

      return selectedHTML;

    }
  });

  // Template instance to output grid of products
  var productGrid = new MW.Component('#mw-productGrid__view', {
    data: {
      individualProducts: null,
      individualFilterTypes: ["measurementType","productType"],
      individualProductsFiltered: null,
      isFiltered: false,
      currentFilterType: null, // Measurement, Product etc.
      sorted: null
    },
    template: function (props) {
      //MW.Util.handlebarsDebugHelper();

      // Save data to localStorage
      localStorage.setItem('individualProducts', JSON.stringify(props.individualProducts));
      localStorage.setItem('individualProductsFiltered', JSON.stringify(props.individualProductsFiltered));

      if ( typeof templateSource !== undefined && typeof dataSourceObject !== undefined ) {
      }
      var $templateContainer = document.querySelector('#mw-productGrid__template');
      var templateSource = $templateContainer.innerHTML;
      var templateHB = Handlebars.compile(templateSource);
      var html;

      // JSON structure may change
      if (!props.individualProductsFiltered || !props.isFiltered) {
        html = templateHB(props.individualProducts);
      }
      else if (props.individualProductsFiltered && props.individualProductsFiltered.items.length > 0) {
        html = templateHB(props.individualProductsFiltered);
      }
      else if (props.individualProductsFiltered && props.individualProductsFiltered.items.length == 0) {
        // If there are no filtered items yet
        html = '<p><em>No items were found.</em></p>';
      }
      return html;
    }
  });

  /**
   * Add a criteria item
   */
  var updateCriteriaSelected = function () {
    // Get the data
    var data = getCriteria();
    if (!data) {
      throw 'Missing criteria to filter.';
      return;
    }
    selected = getCriteriaSelected();

    // Update the state and UI
    criteriaFromUser.setData({criteriaSelected: selected});
  };

  /**
   * Remove a criteria item from the list
   * @param  {String} criteria The value of the criteria
   * in the data state
   */
  var removeCriteriaItem = function (criteria) {
    // Get immutable copy of the data
    var data = getCriteria();
    var list = data.criteriaSelected;

    // Remove the selected criteria item
    var result = MW.Util.arrayRemove(list, criteria);
    /*for ( var i = 0; i < list.length; i++) { 
      if ( list[i] === criteria) {
        list.splice(i, 1); 
        i--;
      }
    }*/

    // Update the state and UI
    criteriaFromUser.setData({criteriaSelected: result});
  };

  /**
   * @name addProductToOrder
   * @author DM
   * @var
   * @function
   * @description Adds a product to the order
   * @param {string} id ID of the product to be added to the order
   */
  var addProductToOrder = function( id ){
    var products = localStorage.getItem( 'individualProducts' ),
    product;

    // make product data usable
    if( !products ){
        return console.warn( 'Cannot add "' + id + '" to order. Products unavailable.' );
    } else {
        products = JSON.parse( products ).items;
    }

    product = products.find((function( product ){
        return product.productID === id;
    }));

    if( product ) MW.Cart.add( product );

  };

  /**
   * Remove all criteria items from the list and 
   * reset Product grid
   */
  var clearCriteriaAll = function () {
    // Confirm first
    //if (!confirm('Are you sure you want to remove all criteria filters?')) return;

    // Update the data and UI
    criteriaFromUser.setData({
      criteriaSelected: []
    });
    productGrid.setData({
      individualProductsFiltered: null
    });
  };

  /**
   * Handle 'click' events
   */
  var clickHandler = function (event) {
    // If remove criteria button
    var criteriaItem = event.target.getAttribute('data-criteria-item-selected');

    if (criteriaItem) {
      //console.log("Remove criteria: ", event.target.getAttribute('data-criteria-item-selected'));
      removeCriteriaItem(criteriaItem);
      toggleFilterButton(criteriaItem);
    }

    // If clear all button
    if (event.target.className === 'js-mw-filterBy__measurement--clear') {
      clearCriteriaAll();
    }

    // If Filter Toolbar Header clicked
    var filterType = event.target.getAttribute('data-target');
    if (filterType) {
      processFilterButtonGroups(event.target);
    }

    if ( event.target.classList.contains( 'mw-productTileAto__button' ) ) addProductToOrder( event.target.dataset.id );

  };

  /**
   * Handle 'change' events (e.g. checkboxes)
   */
  var changeHandler = function (event) {
    // If filter checkbox
    if (event.target.className === config.filterByCheckboxes) {
      updateCriteriaSelected();
      return;
    }
  };

  /**
   * Handle custom 'render' events emitted from 'mw-helper-template.js'
   */
  var renderHandler = function (event) {
    var data = getProducts();
    if (!data.individualProducts) {
      throw 'Missing Individual Products to filter.';
      return;
    }
    var filtered = filterByItemType();

    //console.log("EMIT user-selected criteria: ", event.detail.criteriaSelected);
    //console.log("individualProductsFiltered: ", filtered);
    // Update the state and UI
    // JSON structure may change

    productGrid.setData({
      individualProductsFiltered: {"items": filtered}
    });
    if (filtered.length > 0) {
      productGrid.setData({
        isFiltered: true
      });
      processCriteriaMetabar();
    }
    
  };

  //
  // Inits & Event Listeners
  //
  // If criteria are saved in localStorage, get them
  // Otherwise, render with default
  var _init = function() {
    var getAjaxResponse = function() {
      var dataUrl = document.getElementById('mw-productGrid__view').getAttribute('data-data-source'); //'./data/mw-products.json'
      jQuery.getJSON(dataUrl, renderContent);
    }
    getAjaxResponse();

    // Render 'productGrid' and 'criteriaFromUser'
    function renderContent(data) {
      var saved = localStorage.getItem('criteriaSelected');
      productGrid.setData({individualProducts: data});

      if (saved) {
        //criteriaFromUser.setData({criteriaSelected: JSON.parse(saved)});
        //criteriaFromUser.render();
        //productGrid.render();
      } else {
        productGrid.render();
      }

      console.log("productGrid.data: \n", productGrid.getData());
      console.log("criteriaFromUser.data: \n", criteriaFromUser.getData());
    }
  }
  _init();

  // Add Event Listeners here
  var _addEvents = function() {
    document.addEventListener('click', clickHandler, false);
    document.addEventListener('change', changeHandler, false);
    document.addEventListener('render', renderHandler, false);
  }
  _addEvents();



  /**
   * Get selected criteria list from the DOM
   * @param {DOM NodeList} criteria The collection of the
   * user supplied criteria in the data state
   */
  var getCriteriaSelected = function () {
    var inputs = document.querySelectorAll('.' + config.filterByCheckboxes);
    var checkboxes = [];
    var selected = [];

    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].type == "checkbox") {
        checkboxes.push(inputs[i].checked);
        if (inputs[i].checked) {
          selected.push(inputs[i].value);
        }
      }
    }
    return selected;
  }

  /**
   * Toggle filter checkboxes (faux buttons) from the DOM
   * by comparing user-selected criteria
   * @param {String} criteria The collection of the
   * user supplied criteria in the data state
   * @param {DOM NodeList} buttons The collection of the
   * filter buttons
   */
  var toggleFilterButton = function (criteria) {
    var buttons = Array.from(document.querySelectorAll('.' + config.filterByCheckboxes));
    //var activeFilter = element.closest(selectors);
    if (!buttons || !criteria) {
      throw 'Missing DOM elements to compare.';
      return;
    }

    buttons.map((function(button, index, array) {
      if ( button.value == criteria) {
        button.checked = false;
      }
    }));

  }

  /**
   * Get filtered products according to product type values
   * matching user-selected criteria values
   * @param {Object} g_oIndividualProducts The object 
   * containing all products
   * @param [Array] criteriaSelected The array 
   * containing all user-selected criteria
   */

  var filterByItemType = function() {
    var products = getProducts();
    // JSON structure may change
    var productItems = products.individualProducts.items;
    //console.log("productItems: \n", productItems);

    var filteredProducts = productItems.filter(processFilterTypes);
    return filteredProducts;
  }

  var processFilterTypes = function(productItem) {
    var products = getProducts();
    var filterTypes = products.individualFilterTypes;
    //console.log("productItem: ", productItem);
    //console.log("filterTypes: ", filterTypes);

    var hasMatches = filterTypes.some(hasMatchingFilterValues, productItem);
    return hasMatches;
  }

  var hasMatchingFilterValues = function(item) {
    //console.log("Filter items:", this[item]);
    var filterItems = this[item];
    var selectedItems = criteriaSelected();

    var result = selectedItems.filter(
      (function(item) {
        if (filterItems.indexOf(item) > -1) {
          return true;
        }
        return false;
      })
    )
    //console.log("\tResult: ", result.length !== 0);
    return result.length !== 0;
  };

  var criteriaSelected = function() {
    var criteria = getCriteria();
    //console.log("\tcriteria.criteriaSelected: ", criteria.criteriaSelected)
    return criteria.criteriaSelected;
  };

  var processFilterButtonGroups = function(target) {
    var filterType = productGrid.data.currentFilterType = target.getAttribute('data-target');
    var allFilterTagGroups = Array.from(document.querySelectorAll('.js-mw-filterByTags'));
    var content = document.getElementById(filterType);

    if (!filterType || !allFilterTagGroups) return;
    if (!content) return;

    MW.Util.toggle(content, 'mw-toggle-content');

    allFilterTagGroups.map((function(el) {
      //el.classList.remove('mw-toggle-content');
    }));

    target.closest('.mw-toolbarFilterBy__heading').classList.toggle('mw-is-active');
  };


  var processCriteriaMetabar = function() {
    var products = getProducts();
    var criteriaMetabar = document.querySelector('.mw-toolbarFilterBy__metabar');
    var criteriaBadge = document.querySelector('.mw-toolbarFilterBy__metabar .mw-badge');
    // JSON structure may change
    var productsFiltered = products.individualProductsFiltered.items;
    criteriaBadge.innerHTML = productsFiltered.length;
    MW.Util.addClass(criteriaMetabar, 'mw-is-open');
  };

  var getProducts = function() {
    var products = productGrid.getData();
    return products;
  }

  var getCriteria = function() {
    var criteria = criteriaFromUser.getData();
    return criteria;
  }

  return {
    //init: setup
  };

})(window.ADI = window.ADI || {}, jQuery, window);

// =FILTER("range of values", "condition 1", ["condition 2", ...])

$(document).ready((function() {
  if ( typeof Handlebars == 'undefined' ) {
    return;
  }
  //MW.plpGrid.init();
}));

/**
 * @name ro
 * @description Handles template functionality on the Review Order page
 */
MW.ro = (function() {

    /**
     * @name _addEvents
     * @var
     * @function
     * @description binds events to the view
     */
    var _addEvents = function() {
        document.addEventListener( 'click', handleClick, false );
        document.addEventListener( 'change', handleChange, false );
        document.addEventListener( 'render', handleRender, false );
    }

    /**
     * @name _init
     * @var
     * @function
     * @description initializes the view
     */
    var _init = function() {
        MW.Cart.getDetails((function(){
            cart.render();
            summary.render();
        }));
    }    

    /**
     * @name cart
     * @class
     * @description View of the items in the cart
     */
    var cart = new MW.Component( '#mw-cartList__view', {
        data: {
            items: MW.Cart.get()
        },
        template: function( props ){
            var source = templateCart.innerHTML,
            render = Handlebars.compile( source );
            return ( props.items && props.items.length > 0 ) ? render( props ) : '<p><em>No items were found.</em></p>';
        }
    });

    /**
     * @name handleClick
     * @var
     * @function
     * @description Handles functions to execute when the user clicks
     * @param {EventListenerObject} e 
     */
    var handleClick = function( e ){

        // remove item from the cart
        if( e.target.parentElement.classList.contains( 'mw-orderDetails__removeItem' ) ) productRemove( e.target.parentElement.dataset.id );

    };

    /**
     * @name handleChange
     * @var
     * @function
     * @description Handles functions to execute when input values change
     * @param {EventListenerObject} e 
     */
    var handleChange = function( e ){

        // update order qty
        if( e.target.classList.contains( 'mw-productDetailsAto__qty' ) ) productUpdateQty( e, e.target );

    };

    /**
     * @name handleRender
     * @var
     * @function
     * @description Handles functions to execute after the views have rendered
     * @param {EventListenerObject} e 
     */
    var handleRender = function( e ){
        
    };

    /**
     * @name productRemove
     * @var
     * @function
     * @description Removes an item from the cart then updates the view
     * @param {*} id 
     */
    var productRemove = function( id ){
        MW.Cart.remove( id );
        cart.setData({ items: MW.Cart.get() });
        summary.setData( MW.Cart.summary() );
    }

    /**
     * @name productUpdateQty
     * @var
     * @function
     * @description Updates the quantity for a cart item
     * @param {HTMLElement} input Quantity input of the product being updated
     */
    var productUpdateQty = function( e, input ){
        var value = Number( input.value );
        if( value < 1 ) return alert( 'figure out how to undo change' );
        MW.Cart.update( input.dataset.id, value );
        cart.setData({ items: MW.Cart.get() });
        summary.setData( MW.Cart.summary() );
    }

    /**
     * @name summary
     * @class
     * @description View of the summary of the cart
     */
    var summary = new MW.Component( '#mw-orderDetails__summary', {
        data: MW.Cart.summary(),
        template: function( props ){
            var source = templateSummary.innerHTML,
            render = Handlebars.compile( source );
            return render( props );
        }
    });

    /**
     * @name template
     * @var
     * @description stores HTML for template to allow for re-rendering of the HTML
     */
    var templateCart = document.querySelector( '#mw-cartList__template' ),
    templateSummary = document.querySelector( '#mw-orderDetails__template' );

    _init();
    _addEvents();

    return {};

})( window.ADI = window.ADI || {}, jQuery, window );