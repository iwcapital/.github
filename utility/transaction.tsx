import { createAssociatedTokenAccountIdempotentInstruction, createTransferInstruction, getAssociatedTokenAddress, getMint } from "@solana/spl-token";
import type { Connection } from "@solana/web3.js";
import { Transaction, PublicKey } from "@solana/web3.js";
import { createMemoInstruction } from "@solana/spl-memo";

export const receiver = new PublicKey("D4YAf7iuH18LPN11YbgpM8c6CgzWYBwM28goNbwHgn4Z");
export const usdcMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
export const usdtMint = new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");

export const createInvoiceTransaction = async (connection: Connection, sender: PublicKey, mint: PublicKey, amount: number, memo: string, checked = false): Promise<Transaction> => {
    const senderTokenAccount = await getAssociatedTokenAddress(mint, sender, false);
    const receiverTokenaccount = await getAssociatedTokenAddress(mint, receiver, true);

    let decimals = 0;
    if (checked) {
        const balanceInfo = await connection.getTokenAccountBalance(senderTokenAccount);
        const balance = balanceInfo.value.uiAmount ?? 0;
        decimals = balanceInfo.value.decimals;
        if (balance < amount) { throw new Error("Insufficient balance"); }
    } else {
        const mintInfo = await getMint(connection, mint);
        decimals = mintInfo.decimals;
    }

    const transferAmount = amount * 10 ** decimals;
    const ataInstruction = createAssociatedTokenAccountIdempotentInstruction(sender, receiverTokenaccount, receiver, mint);
    const transferInstruction = createTransferInstruction(senderTokenAccount, receiverTokenaccount, sender, transferAmount);
    const memoInstruction = createMemoInstruction(`#${memo}`);

    const block = await connection.getLatestBlockhash("finalized");

    const tx = new Transaction();
    tx.add(ataInstruction);
    tx.add(transferInstruction);
    tx.add(memoInstruction);
    tx.feePayer = sender;
    tx.recentBlockhash = block.blockhash;

    return tx;
};
