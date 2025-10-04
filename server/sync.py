from db import supabase

def create_or_sync_user(clerk_user_id: str, email: str, full_name: str):
    # Check if user exists
    response = supabase.table("users").select("*").eq("clerk_user_id", clerk_user_id).execute()

    if not response.data:  # user not found
        # Insert new user ( Need to add more details)
        supabase.table("users").insert({
            "clerk_user_id": clerk_user_id,
            "email": email,
            "full_name": full_name
        }).execute()
        return {"clerk_user_id": clerk_user_id, "email": email, "full_name": full_name, "status": "created"}
    
    return {"user": response.data[0], "status": "exists"}
