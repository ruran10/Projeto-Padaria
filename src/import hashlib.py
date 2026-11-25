import hashlib
import secrets
import time
from datetime import datetime

MAX_TENTATIVAS = 5
BLOQUEIO_SEGUNDOS = 30

# Banco de usuários simples para demonstração
usuarios = {}


def criar_usuario(nome, senha):
    salt = secrets.token_bytes(16)
    hash_senha = hashlib.pbkdf2_hmac(
        "sha256",
        senha.encode(),
        salt,
        200_000
    )

    usuarios[nome] = {
        "salt": salt,
        "hash": hash_senha
    }

    print(f"Usuário '{nome}' criado com segurança.")


def verificar_senha(nome, senha):
    if nome not in usuarios:
        return False

    dados = usuarios[nome]  

    novo_hash = hashlib.pbkdf2_hmac(
        "sha256",
        senha.encode(),
        dados["salt"],
        200_000
    )

    return secrets.compare_digest(
        novo_hash,
        dados["hash"]
    )


def registrar(evento):
    agora = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open("seguranca.log", "a", encoding="utf-8") as arquivo:
        arquivo.write(f"[{agora}] {evento}\n")


def login():
    tentativas = 0
    bloqueado_ate = 0

    while True:
        if time.time() < bloqueado_ate:
            restante = int(bloqueado_ate - time.time())
            print(f"🔒 Sistema bloqueado. Aguarde {restante}s.")
            time.sleep(1)
            continue

        nome = input("Usuário: ")
        senha = input("Senha: ")

        if verificar_senha(nome, senha):
            print("✅ Login autorizado!")
            registrar(f"Login bem-sucedido: {nome}")
            return True

        tentativas += 1
        registrar(f"Falha de login: {nome}")

        print("❌ Usuário ou senha incorretos.")

        if tentativas >= MAX_TENTATIVAS:
            bloqueado_ate = time.time() + BLOQUEIO_SEGUNDOS
            registrar(f"Conta temporariamente bloqueada: {nome}")
            tentativas = 0


# Criando usuário de demonstração
criar_usuario("admin", "SenhaSuperForte123!")

# Iniciando sistema
login()
