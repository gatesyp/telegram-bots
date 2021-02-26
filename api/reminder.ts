import { NowRequest, NowResponse } from "@vercel/node";
import { connectToDatabase } from "./_connectToDatabase";
import { sendMsg, StandupGroup, Member, About } from "./_helpers";

module.exports = async (req: NowRequest, res: NowResponse) => {
  const db = await connectToDatabase();
  const groups = await db.collection("groups").find({}).toArray();


  const reminders = []
  groups.forEach((group: StandupGroup) => {
    var item = group.members[Math.floor(Math.random() * group.members.length)];
    var items = [item];

    items.forEach((member: Member) => {
      if (member.submitted === false) {
        reminders.push(sendMsg("Reminder, please submit an update. Updates are due by 10am est", member.about.id))
      }
    });
  });

  await Promise.all(reminders)

  res.json({ status: 200 });

};
