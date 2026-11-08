export const tools = [
    {
        id: "json",
        name: "JSON Biçimlendirici",
        description: "JSON verisini doğrular, biçimlendirir ve küçültür.",
        category: "Geliştirici",
        load: () => import("./tools/json-formatter.js"),
    },
    {
        id: "gradient",
        name: "CSS Gradient Oluşturucu",
        description: "Canlı önizlemeyle CSS gradient kodu üretir.",
        category: "Tasarım",
        load: () => import("./tools/gradient-generator.js")
    },
    {
        id: "text",
        name: "Metin Araçları",
        description: "Metni sayar, dönüştürür ve temizler.",
        category: "Metin ve Paylaşım",
        load: () => import("./tools/text-toolkit.js")
    },
    {
        id: "password",
        name: "Şifre Oluşturucu",
        description: "Tarayıcında güvenli ve rastgele şifreler üretir.",
        category: "Geliştirici",
        load: () => import("./tools/password-generator.js")
    },
    {
        id: "qr",
        name: "QR Kod Oluşturucu",
        description: "Metin veya bağlantıdan QR kod oluşturur.",
        category: "Metin ve Paylaşım",
        load: () => import("./tools/qr-generator.js")
    },
    {
        id: "color",
        name: "Renk Dönüştürücü",
        description: "HEX, RGB ve HSL biçimleri arasında dönüşüm yapar.",
        category: "Tasarım"
    },
];