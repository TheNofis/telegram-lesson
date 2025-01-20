# ADD Invite model

    1. id - uuid
    2. invite: String, unique,
    3. creator_id: Number,
    4. count: Number, default: 1,
    5. active: Boolean, default: false
    6. created_at: default: Date.now()

# ADD Advertisement model

    1. id - uuid
    2. title: String,
    3. conent: String,
    4. image: String {null || url},
    5. creator_id: Number,
    6. created_at: default: Date.now()
