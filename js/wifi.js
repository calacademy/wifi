var WiFi = function () {
	var _endpoint = 'https://legacy.calacademy.org/enews/maropost/';
	var _originalPlaceholder = $('.email').attr('placeholder');
	
	var _msgs = {
		submitting: 'Submitting...',
		serverError: 'Oops. Please try again...',
		invalid: 'Oops. Invalid email...'
	};

	var _isEmail = function (value) {
		var isValid = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test( value );

		if (!isValid) return false;

		// check if dotless
		// @see https://www.icann.org/news/announcement-2013-08-30-en
		var arr = value.split('@');
		return (arr[1].indexOf('.') !== -1);
	}

	var _onSuccess = function (data, textStatus, XMLHttpRequest) {
		if (data.error) {
			_onError();
		} else {
			$('.email').blur();
			$('html').addClass('submitted');	
		}
	}

	var _onError = function (XMLHttpRequest, textStatus, errorThrown) {
		$('.email').val('');
		$('.email').removeAttr('disabled');
		$('.email').attr('placeholder', _msgs.serverError);

		$('form').removeClass('submitting');
	}

	var _onSubmit = function (e) {
		if ($(this).hasClass('submitting')) {
			return false;
		}

		$(this).addClass('submitting');
		
		var field = $('.email', this);
		var email = $.trim(field.val()).toLowerCase();

		if (!_isEmail(email)) {
			field.val('');
			field.attr('placeholder', _msgs.invalid);
			$(this).removeClass('submitting');
			return false;
		}

		field.val('');
		field.blur();
		field.attr('disabled', 'true');
		field.attr('placeholder', _msgs.submitting);

		var data = {
			email: email,
			list_ids: parseInt($('.list_id', this).val()),
			trigger_journey: 1,
			journey_id: '',
			trigger_id: ''
		};

		var journeyId = parseInt($('.journey_id', this).val());
		var triggerId = parseInt($('.trigger_id', this).val());

		if (!isNaN(journeyId) && !isNaN(triggerId)) {
			data.journey_id = journeyId;
			data.trigger_id = triggerId;
		}

		if ($('.custom_field', this).length > 0) {
			var jsonObj = {};

			$('.custom_field', this).each(function () {
				jsonObj[$(this).attr('name')] = $(this).val();
			});

			data.custom_field = JSON.stringify(jsonObj);
		}

		$.ajax({
			dataType: 'jsonp',
			url: _endpoint,
			data: data,
			success: _onSuccess,
			error: _onError
		});

		return false;
	}

	this.initialize = function () {
		$(window).on('load', function () {
			$('html').addClass('loaded');
			$('body').addClass('bg-' + Math.round(Math.random() * 4));
		});

		$('form').on('submit', _onSubmit);
	}

	this.initialize();
}
