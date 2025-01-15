class User:
    def __init__(self, mongo):
        self.collection = mongo.db.users

    def find_user_by_email(self, email):
        return self.collection.find_one({"email": email})

    def create_user(self, user_data):
        try:
            result = self.collection.insert_one(user_data)
            print(f"User inserted with ID: {result.inserted_id}")
            return result.inserted_id
        except Exception as e:
            print(f"Error inserting user: {e}")
            return None
