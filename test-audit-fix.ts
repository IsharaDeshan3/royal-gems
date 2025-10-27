import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Test script to verify audit log fix
async function testAuditLogFix() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  console.log('Testing audit log fix...');

  try {
    // First, let's check if there are any gems to delete
    const { data: gems, error: fetchError } = await supabase
      .from('gems')
      .select('id, name')
      .limit(1);

    if (fetchError) {
      console.error('Error fetching gems:', fetchError);
      return;
    }

    if (!gems || gems.length === 0) {
      console.log('No gems found to test with. Please create a gem first.');
      return;
    }

    const testGem = gems[0];
    console.log(`Found test gem: ${testGem.name} (ID: ${testGem.id})`);

    // Now test the audit log creation directly
    const auditLogData = {
      action: 'DELETE_GEM',
      entity_type: 'gem',
      entity_id: testGem.id,
      changes: {
        gemName: testGem.name,
        category: 'test',
      },
    };

    console.log('Testing audit log creation with correct schema...');
    const { data: auditResult, error: auditError } = await supabase
      .from('audit_logs')
      .insert(auditLogData)
      .select();

    if (auditError) {
      console.error('Audit log creation failed:', auditError);
      return;
    }

    console.log('✅ Audit log created successfully:', auditResult);

    // Clean up the test audit log
    await supabase
      .from('audit_logs')
      .delete()
      .eq('id', auditResult[0].id);

    console.log('✅ Test completed successfully - audit log schema is correct!');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAuditLogFix();