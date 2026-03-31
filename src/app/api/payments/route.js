import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Transaction from '@/models/Transaction';
import { publishTransactionEvent } from '@/lib/kafka';

export async function POST(req) {
    try {
        const body = await req.json();
        const { amount, currency = 'MYR', invoiceNumber, vendorName } = body;

        if (!amount) {
            return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
        }

        const reference = `PB-${Date.now().toString(36).toUpperCase()}`;

        // Execute heavy database and Kafka processes in the background
        const processPayment = async () => {
            try {
                await connectToDatabase();
                const transaction = new Transaction({
                    reference,
                    fromAccount: '312345678901',
                    toAccount: vendorName || 'external-vendor',
                    amount,
                    currency,
                    type: 'bill_payment',
                    status: 'pending',
                    description: `Payment for invoice ${invoiceNumber || 'N/A'}`
                });

                await transaction.save();

                const event = {
                    type: 'TRANSFER_COMPLETED',
                    reference,
                    fromAccount: '312345678901',
                    toAccount: vendorName || 'external-vendor',
                    amount,
                    currency,
                    timestamp: new Date().toISOString()
                };

                await publishTransactionEvent(event);
                console.log(`[Payment] Background processing successful for ${reference}`);
            } catch (err) {
                console.error(`[Payment] Background processing failed for ${reference}:`, err);
            }
        };

        // Run without awaiting
        processPayment();

        // Immediately return success
        return NextResponse.json({ success: true, transaction: { reference, amount, currency, status: 'processing' } });
    } catch (error) {
        console.error('Payment request Error:', error);
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}
