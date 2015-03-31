<?php
/**
 * Folder Info
 *
 * Plugin to show information message above the messages list
 *
 * @date 2015-03-31
 * @version 1.0
 * @author Alexander Pushkin
 * @url https://github.com/San4oP/folder_info
 * @licence GNU GPLv3
 */
class folder_info extends rcube_plugin
{
	public $task = 'mail';

	function init()
	{
		$rcmail = rcube::get_instance();
		$this->load_config();

		$this->include_stylesheet($this->local_skin_path() . '/folder_info.css');
		$this->include_script('folder_info.js');

		$this->add_hook('template_object_messages', array($this, 'add_info_message'));
		$this->add_texts('localization/', true);

		$this->api->output->set_env('folder_info_messages', $rcmail->config->get('folder_info_messages', array()));
		$this->api->output->set_env('folder_info_messages_args', $rcmail->config->get('folder_info_messages_args', array()));
	}

	function add_info_message($data)
	{
		$data['content'] = '<div id="folder_info"></div>'.$data['content'];

		return $data;
	}
}

?>