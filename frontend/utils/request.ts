import { Client, Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import { Wallet } from "ethers";

const wallet = Wallet.createRandom();

const testADdress = "0x3F11b27F323b62B159D2642964fa27C46C841897";

export async function connect(
  wallet: Wallet,
  targetAddress: string,
  newMessage: string,
): Promise<void> {
  // Create the client with your wallet. This will connect to the XMTP development network by default
  const xmtp: Client = await Client.create(wallet);
  // Start a conversation with XMTP
  const conversation: Conversation = await xmtp.conversations.newConversation(
    targetAddress,
  );


  const allConversations = await xmtp.conversations.list()
  // Say gm to everyone you've been chatting with
  for (const conversation of allConversations) {
    console.log(`Saying GM to ${conversation.peerAddress}`)
    await conversation.send('gm')
  }

  // Load all messages in the conversation
  const messages: DecodedMessage[] = await conversation.messages();
  // Send a message
  await conversation.send(newMessage);
  // Listen for new messages in the conversation
  for await (const message of await conversation.streamMessages()) {
    console.log(`[${message.senderAddress}]: ${message.content}`);
  }
}
