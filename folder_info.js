var update_message = function(folder) {
   var formating = function(message) {
     if( folder in rcmail.env.folder_info_messages_args ) {
       switch( typeof rcmail.env.folder_info_messages_args[folder] ) {
         case 'number':
         case 'string':
           message = message.replace('{}', rcmail.env.folder_info_messages_args[folder]);
           break;
         default:
           for(var i=0; i<rcmail.env.folder_info_messages_args[folder].length; i++) {
             message = message.replace('{}', rcmail.env.folder_info_messages_args[folder][i]);
           }
           break;
       }
     }
     return message;
   };
   switch( folder ) {
     case rcmail.env.trash_mailbox:
       $('#folder_info').html(formating(rcmail.gettext('trash_message', 'folder_info')));
       $('#folder_info').show();
       break;
     case rcmail.env.junk_mailbox:
       $('#folder_info').html(formating(rcmail.gettext('junk_message', 'folder_info')));
       $('#folder_info').show();
       break;
     default:
       if( folder in rcmail.env.folder_info_messages ) {
         $('#folder_info').html(formating(rcmail.env.folder_info_messages[folder]));
         $('#folder_info').show();
       } else {
         $('#folder_info').html('');
         $('#folder_info').hide();
       }
       break;
   }
};

rcmail.addEventListener('init', function(evt){ if( evt.task == "mail" ) {update_message(rcmail.env.mailbox);} });
rcmail.addEventListener('selectfolder', function(evt){ update_message(evt.folder); });