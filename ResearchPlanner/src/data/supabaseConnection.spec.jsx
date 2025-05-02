import { supabase } from './supabaseClient.js';

describe('Supabase Connection', () => {
  test('Fetch first row from users table', async () => {
    if (!supabase) {
      throw new Error('Supabase client is not initialized.');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')

    //   if (error) {
    //     console.error('Erro ao buscar usuários:', error.message);
    //   } else {
    //     console.log('Usuários:', data);  // Imprime os usuários no console
    //   }

    expect(error).toBeNull();
    expect(data).toBeDefined();
    // expect(data.length).toBeGreaterThan(0);
  });
});
