import { createTransferInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import type { Connection } from "@solana/web3.js";
import { Transaction, PublicKey } from "@solana/web3.js";
import { createMemoInstruction } from "@solana/spl-memo";

export const receiver = new PublicKey("5jzLMhn1rCLEf4UgMoiSY9LEs6azuCbfoKthHQsg2KB7");
export const usdcMint = new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
export const usdtMint = new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");

export const createCheckoutTransaction = async (connection: Connection, sender: PublicKey, mint: PublicKey, amount: number, memo: string, checked = false): Promise<Transaction> => {
    const memoInstruction = createMemoInstruction(`#${memo}`);

    const senderTokenAccount = await getAssociatedTokenAddress(mint, sender, false);
    const receiverTokenaccount = await getAssociatedTokenAddress(mint, receiver, true);

    const balanceInfo = await connection.getTokenAccountBalance(senderTokenAccount);
    const balance = balanceInfo.value.uiAmount ?? 0;
    if (balance < amount && checked) { throw new Error("Insufficient balance"); }

    const transferAmount = amount * 10 ** balanceInfo.value.decimals;
    const transferInstruction = createTransferInstruction(senderTokenAccount, receiverTokenaccount, sender, transferAmount);

    const block = await connection.getLatestBlockhash("finalized");

    const tx = new Transaction();
    tx.add(memoInstruction);
    tx.add(transferInstruction);
    tx.feePayer = sender;
    tx.recentBlockhash = block.blockhash;

    return tx;
};
