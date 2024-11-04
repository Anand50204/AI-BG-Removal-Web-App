
import { Webhook } from "svix";
import userModel from "../models/userModel.js";
// api Controller function to manage Clerk User Withe  database
//http:/locakhost:400/api/user/webhooks

const clerkWebhooks = async (req, res) => {
    try {
        // Creat a svix instance withe clerk wenhook
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body), {
            "svis-id": req.header["svix-id"],
            "svix-timestamp": req.header["svix-timestamp"],
            "svix-signature": req.header["svix-signature"]
        })

        const { data, type } = req.body;
        switch (type) {
            case "user.created": {

                const userdata = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url,
                }
                await userModel.create(userdata);
                res.json({})
                break;
            }
            case "user.updated": {

                const userdata = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url,
                }

                await userModel.findOneAndUpdate({ clerkId: data.id }, userdata)
                res.json({})
                break;
            }
            case "user.deleted": {

                await userModel.findByIdAndDelete({ clerkId: data.id })
                res.json({})
                break;
            }
            default:
                break;
        }

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

export {clerkWebhooks};