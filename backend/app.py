from app import create_app

app = create_app()

if __name__ == '__main__':
    print("\n🌱 EcoChat Backend rodando!")
    print("📍 Acesse: http://127.0.0.1:5000")
    print("\n👥 Usuários de teste:")
    print("   - teste@eco.com / 123456")
    print("   - maria@email.com / 123456")
    print("   - joao@email.com / 123456")
    print("   - ana@email.com / 123456")
    print("   - pedro@gmail.com / 123456")
    print("\n📸 Sistema EcoReal ativado!")
    app.run(debug=True, host='127.0.0.1', port=5000)