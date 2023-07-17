<script setup lang="ts">
import { api } from "../services/api.js";
import { storeToken } from "../services/storage.js";
import { ref } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { useRouter } from "vue-router";
import { store } from "../services/store.js";

const passwordInput = ref("");
const userInput = ref("");
const checked = ref("");
const router = useRouter();

function clickSend() {
    let data = {
        password: passwordInput.value,
        username: userInput.value,
    };
    api.post("/api/auth/login", data)
        .then((response: any) => {
            if (response.status == 200) {
                storeToken(response.data.accessToken);
                store.idUsuario = response.data.id;
                router.push("/");
            }
        })
        .catch((error: any) => {
            if (error.response.status == 401) {
                toast.error("Usuário ou senha incorretos!", {
                    autoClose: 2000,
                });
            } else {
                toast.error("Erro no login!", {
                    autoClose: 2000,
                });
            }
        });
}
</script>

<template>
    <div class="page-login">
        <h1 class="big-title">Seja bem vindo(a) à sua agenda pessoal!</h1>

        <p class="subtitle">Faça login para continuar</p>

        <div class="login-container">
            <input v-model="userInput" ref="user" placeholder="Usuário" />

            <input
                v-model="passwordInput"
                placeholder="Senha"
                type="password"
            />

            <div class="checkbox-remember">
                <input type="checkbox" id="checkbox" v-model="checked" />
                <label for="checkbox">Lembrar dados de login</label>
            </div>

            <div @click="clickSend" class="common-button"><p>Enviar</p></div>
        </div>
    </div>
</template>

<style lang="scss">
@import "../scss/app.scss";
@import "../scss/login.scss";
</style>
