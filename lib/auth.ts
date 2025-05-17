// Bu dosya sadece gerekli fonksiyonları içerir
// Gerçek kimlik doğrulama işlemleri kaldırılmıştır

/**
 * Kullanıcının oturumlarını almak için kullanılır
 * Artık sadece verilen oturum kimliklerini döndürür
 */
export async function getUserSessions(userId: string): Promise<string[]> {
  // Artık kullanıcı kimliğini kullanmıyoruz, sadece boş bir dizi döndürüyoruz
  return []
}
