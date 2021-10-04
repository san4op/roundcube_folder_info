/**
 * Folder Info plugin script
 */

$(function() {
	function folder_info_plugin() {
		this.base_element;
		this.fixed_element;

		this.messages = {};
		this.args = {};

		var ref = this;

		this.init = function() {
			this.messages = rcmail.env.folder_info_messages;
			this.args = rcmail.env.folder_info_messages_args;

			this.base_element = $('.folder_info');
			this.fixed_element = this.base_element.clone()
				.addClass('folder_info_fixed')
				.css({position: 'fixed'});
			this.base_element.before(this.fixed_element);

			rcmail.addEventListener('init', function(event) {
				if (event.task === 'mail') {
					ref.update(rcmail.env.mailbox);

					var splitter;
					switch (rcmail.env.skin) {
						case 'classic':
						case 'larry':
							splitter = $('#mailviewsplitterv, #mailviewsplitter2');
							break;
						case 'elastic':
							splitter = $('.column-resizer');
							break;
					}
					console.log(splitter);
					if (typeof splitter === 'object' && splitter.length > 0) {
						splitter.on('mousedown.folder_info', function() {
							$(document).on('mouseup.folder_info', function() { ref.updateUI(); });
						});
					}
				}
				else if (event.task === 'settings' && event.action === 'edit-folder') {
					rcmail.enable_command('toggle-editor', true);
					rcmail.editor_init(rcmail.env.editor_config, 'rcmfd_folder_info_message');
				}
			});

			rcmail.addEventListener('selectfolder', function(event) {
				ref.update(event.folder);
			});

			rcmail.addEventListener('listupdate', function() {
				ref.updateUI();
			});

			window.addEventListener('resize', function() {
				ref.updateUI();
			});
		};

		this.format = function(message) {
			if (this.folder in this.args) {
				switch (typeof this.args[this.folder]) {
					case 'number':
					case 'string':
						message = message.replace('{}', this.args[this.folder]);
						break;
					case 'object':
						for (var i = 0; i < this.args[this.folder].length; i++) {
							message = message.replace('{}', this.args[this.folder][i]);
						}
						break;
				}
			}
			return message;
		};

		this.update = function(folder) {
			this.folder = folder;

			if (folder in this.messages) {
				if (typeof this.messages[folder] === 'string') {
					this.set_message(this.messages[folder]);
				}
				else {
					this.set_message('');
				}
			}
			else switch (folder) {
				case rcmail.env.trash_mailbox:
					this.set_message(rcmail.gettext('trash_message', 'folder_info'));
					break;
				case rcmail.env.junk_mailbox:
					this.set_message(rcmail.gettext('junk_message', 'folder_info'));
					break;
				default:
					this.set_message('');
					break;
			}
		};

		this.updateUI = function() {
			this.fixed_element.width($('#messagelist').width());
		};

		this.set_message = function(message) {
			if (message !== '') {
				message = this.format(message);
			}
			$('.folder_info > span').html(message);
			$('.folder_info')[message !== '' ? 'show' : 'hide']();
			if (rcmail.env.skin === 'larry') {
				$('.messagelist thead th:first-child').css('border-top-left-radius', message !== '' ? '0' : '');
			}
		};
	}

	var folder_info = new folder_info_plugin();

	folder_info.init();
});
