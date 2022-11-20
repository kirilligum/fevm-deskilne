import { Client, Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import { InvitationContext } from "@xmtp/xmtp-js/dist/types/src/Invitation";
import { Wallet } from "ethers";

const wallet = Wallet.createRandom();

const testADdress = "0x3F11b27F323b62B159D2642964fa27C46C841897";

// todo need to put this in a global context
// ready context here https://github.com/devlyn37/eth-sf-complisend/blob/bf09ee6b39b6fcf449d628e1976158dd1e8f6305/frontend/context/xmtp.ts
// here a provider https://github.com/devlyn37/eth-sf-complisend/blob/b29d136bf11e41955bb61db4c7cb938a667d76e7/frontend/providers/XmtpProvider.tsx
// sample sending form for speed https://github.com/devlyn37/eth-sf-complisend/blob/ae50698309f8762287414c10397d46b2cd629359/frontend/components/SendingForm.tsx


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

  const isOnDevNetwork = await Client.canMessage(
  '0x3F11b27F323b62B159D2642964fa27C46C841897'
  )

  const l = 'mydomain.xyz/foo';
  const invite: InvitationContext = {
    conversationId: l,
    metadata: {}
  };
  const conversation1 = await xmtp.conversations.newConversation(
  '0x3F11b27F323b62B159D2642964fa27C46C841897',invite
)


  // Load all messages in the conversation
  const messages: DecodedMessage[] = await conversation.messages();
  // Send a message
  await conversation.send(newMessage);
  // Listen for new messages in the conversation
  for await (const message of await conversation.streamMessages()) {
    console.log(`[${message.senderAddress}]: ${message.content}`);
  }
}
