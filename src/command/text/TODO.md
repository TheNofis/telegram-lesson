# TODO:

1. add admin middleware

2. add admin /invite

   # invite

   1. if user have admin role create this text
      userid:uuid
      example: 6201764240:AAEeZRWHvervgMGZ4It5IWBfy1hGSscy9d1

3. add admin /accept
   # accept
   1. user have any role
   2. /accept {userid:uuid}
   3. if this text found in db, add admin role to user
4. add admin command: /newadv {text}
