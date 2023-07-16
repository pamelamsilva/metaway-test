<script setup lang="ts">
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import { vMaska } from "maska";
import { useRouter } from "vue-router";
import { api } from "../services/api.js";
import { getToken } from "../services/storage.js";
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const pessoa = ref("");
const numero = ref("");
const tipoNumero = ref("Celular");
const emailInput = ref("");
const checked = ref(false);
let pessoas: any = ref([]);

function isAuthorized() {
    const router = useRouter();
    if (getToken() == null) {
        router.push("/login");
    }
}

async function listPeople() {
    let data = {
        nome: "",
    };
    return api.post("/api/pessoa/pesquisar", data);
}

onMounted(async () => {
    isAuthorized();
    pessoas.value = (await listPeople()).data;
});

function clickSend() {
    if (pessoa.value == "") {
        toast.error("Selecione uma pessoa!", {
            autoClose: 2000,
        });
    } else if (numero.value == "") {
        toast.error("Insira um número!", {
            autoClose: 2000,
        });
    } else if (
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailInput.value)
    ) {
        toast.error("Insira um email válido!", {
            autoClose: 2000,
        });
    } else {
        let data = {
            email: emailInput.value,
            pessoa: pessoa.value,
            privado: checked.value,
        };
        api.post("/api/contato/salvar", data);
    }
}
</script>

<template>
    <div class="page-new-contact">
        <Header></Header>

        <div class="general">
            <div class="select-container" v-if="pessoas">
                <label for="pessoa">Selecione a pessoa</label>
                <select v-model="pessoa">
                    <option v-for="p in pessoas" :value="p">
                        {{ p.nome }}
                    </option>
                </select>
            </div>

            <div class="grid">
                <div>
                    <label for="numero">Número</label>
                    <input
                        v-model="numero"
                        placeholder="Número"
                        type="text"
                        v-maska
                        data-maska="['+55 (##) #####-####', '+55 (##) ####-####']"
                    />
                </div>

                <div class="grid">
                    <div>
                        <label>Tipo de Número</label>
                        <div class="radio-buttons">
                            <div>
                                <input
                                    type="radio"
                                    id="Celular"
                                    name="Celular"
                                    value="Celular"
                                    v-model="tipoNumero"
                                />
                                <label for="Celular">Celular</label>
                            </div>

                            <div>
                                <input
                                    type="radio"
                                    id="Fixo"
                                    name="Fixo"
                                    value="Fixo"
                                    v-model="tipoNumero"
                                />
                                <label for="Fixo">Fixo</label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label>Privacidade</label>
                        <div class="checkbox-container">
                            <input
                                type="checkbox"
                                id="checkbox"
                                v-model="checked"
                            />
                            <label for="checkbox">Privado</label>
                        </div>
                    </div>
                </div>
            </div>

            <label for="emailInput">Email</label>
            <input
                class="email"
                v-model="emailInput"
                placeholder="Exemplo@gmail.com"
                type="text"
            />

            <div class="common-button" @click="clickSend">
                <p>Cadastrar contato</p>
            </div>
        </div>

        <Footer></Footer>
    </div>
</template>

<style lang="scss">
@import "../scss/app.scss";
@import "../scss/new-contact.scss";
</style>
