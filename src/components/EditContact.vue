<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from "../services/api.js";
import { getToken } from "../services/storage.js";

const router = useRouter();
const props = defineProps([
    "id",
    "telefone",
    "tipoContato",
    "privado",
    "email",
    "pessoa",
]);
const numero = ref(props.telefone);
const tipoNumero = ref(props.tipoContato);
const emailInput = ref(props.email);
const checked = ref(props.privado);
import { toast } from "vue3-toastify";

function isAuthorized() {
    const router = useRouter();
    if (getToken() == null) {
        router.push("/login");
    }
}

onMounted(async () => {
    isAuthorized();
});

function clickSend() {
    if (numero.value == "") {
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
            id: props.id,
            email: emailInput.value,
            pessoa: props.pessoa,
            privado: checked.value,
        };
        api.post("/api/contato/salvar", data)
            .then((response: any) => {
                if (response.status == 200) {
                    toast.success("Contato editado com sucesso!", {
                        autoClose: 2000,
                    });
                    setTimeout(() => router.push("/"), 2000);
                }
            })
            .catch((error: any) => {
                if (error.response.status == 401) {
                    router.push("/login");
                } else {
                    toast.error("Erro na edição!", {
                        autoClose: 2000,
                    });
                }
            });
    }
}
</script>

<template>
    <div class="background">
        <div class="page-edict-contact">
            <div class="close">
                <p @click="$emit('close')">x</p>
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
                                    id="CELULAR"
                                    name="CELULAR"
                                    value="CELULAR"
                                    v-model="tipoNumero"
                                />
                                <label for="CELULAR">CELULAR</label>
                            </div>

                            <div>
                                <input
                                    type="radio"
                                    id="TELEFONE"
                                    name="TELEFONE"
                                    value="TELEFONE"
                                    v-model="tipoNumero"
                                />
                                <label for="TELEFONE">TELEFONE</label>
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

            <div class="common-button" @click="clickSend()">
                <p>Salvar contato</p>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
@import "../scss/app.scss";
@import "../scss/edit-contact.scss";
</style>
