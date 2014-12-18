/* global chrome, window, document */

var PopupController = function () {
	this._actions = document.querySelectorAll('a.action');
	this._updateActions();
	this._addListeners();
};

PopupController.prototype = {
	/**
	* A cached reference to the button elements.
	*
	* @type {Elements}
	* @private
	*/
	_actions: null,

	/**
	* Adds event listeners to the button in order to capture a user's click, and
	* perform some action in response.
	*
	* @private
	*/
	_addListeners: function () {
		for (var i = 0; i < this._actions.length; i++) {
			this._actions[i].addEventListener('click', this._handleActionClick.bind(this));
		}
	},

	/**
	* Update actions according to settings
	*
	* @private
	*/
	_updateActions: function() {
		var settings = chrome.extension.getBackgroundPage().getSettings(),
			param;

		for (var i = 0; i < this._actions.length; i++) {
			param = this._actions[i].getAttribute('data-action');
			if (settings[param]) {
				this._actions[i].classList.add('active');
			}
		}
	},

	/**
	* Toggle settings param on/off and update actions
	*
	* @param {string} can be: isenabled (@TODO: loglevel)
	* @private
	*/
	_toggleParam: function(param) {
		var settings = chrome.extension.getBackgroundPage().getSettings();

		settings[param] = !settings[param];
		chrome.extension.getBackgroundPage().setSettings(settings);
		this._updateActions();
	},

	/**
	* When a user clicks the button, this method is called: it change settings param by calling _toggleParam
	*
	* @type {Event}
	* @private
	*/
	_handleActionClick: function (ev) {
		ev.preventDefault();

		this._toggleParam(ev.currentTarget.getAttribute('data-action'));
		window.close();
	}
};

document.addEventListener('DOMContentLoaded', function () {
	window.PC = new PopupController();
});
