// Hapus TEMPLATES dan TemplateMeta yang lama
export type TemplateId = string; // Jadi bebas, tidak hanya "ats-1" | "ats-2"

export class TemplateService {
    // Karena tidak ada daftar tetap, kita bisa menganggap ID apa saja valid 
    // selama tidak kosong, atau kamu bisa mengecek ke tabel khusus di Supabase jika ada.
    exists(templateId: string): boolean {
        return templateId.length > 0; 
    }

    // Jika FE tetap butuh daftar ID template untuk ditampilkan di UI, 
    // kamu bisa mengembalikan array string sederhana saja.
    listIds(): string[] {
        return ["ats-1", "minimalist-1", "executive-1","modern tech-1"];
    }
}