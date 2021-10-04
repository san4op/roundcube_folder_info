<?php
/**
 * Folder Info
 *
 * Plugin to show information message above the messages list
 *
 * @date 2016-03-10
 * @version 1.0-dev
 * @author Alexander Pushkin
 * @url https://github.com/san4op/folder_info
 * @licence GNU GPLv3
 */

class folder_info extends rcube_plugin
{
	public $task = 'mail|settings';
	private $rc;

	function init()
	{
		$this->rc = rcube::get_instance();
		$this->load_config();

		$this->include_stylesheet($this->local_skin_path() . '/folder_info.css');
		$this->include_script('folder_info.js');
		$this->add_texts('localization/', true);

		switch ($this->rc->task) {
			case 'mail':
				$this->api->output->set_env('folder_info_messages', $this->rc->config->get('folder_info_messages', array()));
				$this->api->output->set_env('folder_info_messages_args', $this->rc->config->get('folder_info_messages_args', array()));
				$this->add_hook('template_object_messages', array($this, 'add_info_message'));
				break;
			case 'settings':
				$this->add_hook('folder_form', array($this, 'folder_form'));
				$this->add_hook('folder_create', array($this, 'folder_save'));
				$this->add_hook('folder_update', array($this, 'folder_save'));
				break;
		}
	}

	function add_info_message($data)
	{
		$data['content'] = '<div class="folder_info"><span></span></div>'.$data['content'];

		return $data;
	}

	function folder_form($args)
	{
		$folder = $args['name'];

		// load html editor
		$this->rc->html_editor('identity'); // using "identity" for minimal editor
		$this->api->output->add_label('editorwarning');

		// load messages
		$messages = $this->rc->config->get('folder_info_messages', array());

		// get folder's message
		if (isset($messages[$folder])) {
			$value = $messages[$folder];
		}
		else switch ($folder) {
			case $this->rc->config->get('trash_mbox'):
				$value = $this->gettext('trash_message');
				break;
			case $this->rc->config->get('junk_mbox'):
				$value = $this->gettext('junk_message');
				break;
			default:
				$value = '';
		}

		// add field: textarea
		$field_message = new html_textarea(array(
			'id' => 'rcmfd_folder_info_message',
			'name' => 'rcmfd_folder_info_message',
			'rows' => 6,
			'cols' => 40,
			'spellcheck' => true,
		));
		$args['form']['props']['fieldsets']['settings']['content']['folder_info_message'] = array(
			'label' => $this->gettext('folder_info_message'),
			'value' => $field_message->show($value),
		);

		// add field: checkbox
		$field_htmleditor = new html_checkbox(array(
			'id' => 'rcmfd_folder_info_htmleditor',
			'name' => 'rcmfd_folder_info_htmleditor',
			'value' => '1',
			'onclick' => 'return rcmail.command(\'toggle-editor\', {id: \'rcmfd_folder_info_message\', html: this.checked, noconvert: true}, \'\', event)',
		));
		$args['form']['props']['fieldsets']['settings']['content']['folder_info_htmleditor'] = array(
			'label' => $this->gettext('folder_info_htmleditor'),
			'value' => $field_htmleditor->show(false),
		);

		return $args;
	}

	function folder_save($args)
	{
		$folder = $args['record']['name'];

		// load messages
		$messages = $this->rc->config->get('folder_info_messages', array());

		// set new message
		$message = rcube_utils::get_input_value('rcmfd_folder_info_message', rcube_utils::INPUT_POST, true);
		$messages[$folder] = strval($message);

		// save messages
		$this->rc->user->save_prefs(array('folder_info_messages' => $messages));

		return $args;
	}
}

?>
