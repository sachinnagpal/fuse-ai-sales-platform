import { createReadStream } from 'fs';
import { createInterface } from 'readline';
import mongoose from 'mongoose';
import { Company } from '../models/Company';
import dotenv from 'dotenv';

dotenv.config();

const BATCH_SIZE = 1000; // Number of records to insert at once
const JSON_FILE_PATH = '/Users/sahilnagpal/Downloads/free_company_dataset.json';

async function importData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/company-prospector');
    console.log('Connected to MongoDB');

    // Create read stream
    const fileStream = createReadStream(JSON_FILE_PATH);
    const rl = createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let batch: any[] = [];
    let count = 0;
    let isFirstLine = true;

    // Process file line by line
    for await (const line of rl) {
      try {
        // Skip the first line if it's just an opening bracket
        if (isFirstLine) {
          isFirstLine = false;
          if (line.trim() === '[') continue;
        }

        // Remove trailing comma if present
        const cleanLine = line.replace(/,\s*$/, '');
        
        // Skip empty lines or closing bracket
        if (!cleanLine || cleanLine === ']') continue;

        const company = JSON.parse(cleanLine);
        
        // Add required fields if missing
        const enrichedCompany = {
          ...company,
          isSaved: false,
          description: company.description || '',
          linkedin_url: company.linkedin_url || ''
        };

        batch.push(enrichedCompany);
        count++;

        // Insert batch when it reaches the batch size
        if (batch.length >= BATCH_SIZE) {
          await Company.insertMany(batch, { ordered: false });
          console.log(`Imported ${count} companies`);
          batch = [];
        }
      } catch (error) {
        console.error('Error processing line:', error);
        continue;
      }
    }

    // Insert remaining records
    if (batch.length > 0) {
      await Company.insertMany(batch, { ordered: false });
      console.log(`Imported final batch of ${batch.length} companies`);
    }

    console.log(`Total companies imported: ${count}`);
    await mongoose.disconnect();
    console.log('Import completed');

  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  }
}

importData(); 