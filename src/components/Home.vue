<script setup lang="ts">
import { api } from "../services/api.ts";
import { getToken } from "../services/storage.ts";
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { useRouter } from "vue-router";
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import EditContact from "./EditContact.vue";

const router = useRouter();
const search = ref("");
let contacts: any = ref([]);
let favorites: any = ref([]);
let modalActive: any = ref(false);
let currentContact: any = ref();

function isAuthorized() {
    const router = useRouter();
    if (getToken() == null) {
        router.push("/login");
    }
}

async function listContacts() {
    let data = {
        termo: search.value,
    };

    return api.post("/api/contato/pesquisar", data);
}

async function onSearch() {
    contacts.value = (await listContacts()).data;
}

async function listFavorites() {
    return api.get("/api/favorito/pesquisar");
}

function toggleFavorite(contact: any) {
    let c = { ...contact };

    console.log(c);

    if (favorites.value.includes(contact.id)) {
        api.delete(`api/favorito/remover/${contact.id}`)
            .then((response: any) => {
                if (response.status == 200) {
                    toast.success("Contato removido dos favoritos!", {
                        autoClose: 2000,
                    });
                }
            })
            .catch((error: any) => {
                if (error.response.status == 401) {
                    router.push("/login");
                } else {
                    toast.error("Erro no servidor!", {
                        autoClose: 2000,
                    });
                }
            });
    } else {
        api.post("api/favorito/salvar", { data: c })
            .then((response: any) => {
                if (response.status == 200) {
                    toast.success("Contato adicionados aos favoritos!", {
                        autoClose: 2000,
                    });
                }
            })
            .catch((error: any) => {
                if (error.response.status == 401) {
                    router.push("/login");
                } else {
                    toast.error("Erro no servidor!", {
                        autoClose: 2000,
                    });
                }
            });
    }
}

function deleteContact(contact: any) {
    api.delete(`api/contato/remover/${contact.id}`)
        .then((response: any) => {
            if (response.status == 200) {
                toast.success("Contato removido com sucesso!", {
                    autoClose: 2000,
                });
                onSearch();
            }
        })
        .catch((error: any) => {
            if (error.response.status == 401) {
                router.push("/login");
            } else {
                toast.error("Erro no servidor!", {
                    autoClose: 2000,
                });
            }
        });
}

function openModal(contact: any) {
    modalActive.value = true;
    currentContact.value = contact;
}

onMounted(async () => {
    isAuthorized();

    const { data } = await listFavorites();
    favorites.value = data.map((d: any) => d.id);

    contacts.value = (await listContacts()).data;
});
</script>

<template>
    <div class="page-home">
        <Header></Header>

        <div class="search">
            <input
                type="text"
                v-model="search"
                placeholder="Pesquise contatos"
            />

            <div class="button" @click="onSearch()">
                <svg
                    width="800px"
                    height="800px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.0392 15.6244C18.2714 14.084 19.0082 12.1301 19.0082 10.0041C19.0082 5.03127 14.9769 1 10.0041 1C5.03127 1 1 5.03127 1 10.0041C1 14.9769 5.03127 19.0082 10.0041 19.0082C12.1301 19.0082 14.084 18.2714 15.6244 17.0392L21.2921 22.707C21.6828 23.0977 22.3163 23.0977 22.707 22.707C23.0977 22.3163 23.0977 21.6828 22.707 21.2921L17.0392 15.6244ZM10.0041 17.0173C6.1308 17.0173 2.99087 13.8774 2.99087 10.0041C2.99087 6.1308 6.1308 2.99087 10.0041 2.99087C13.8774 2.99087 17.0173 6.1308 17.0173 10.0041C17.0173 13.8774 13.8774 17.0173 10.0041 17.0173Z"
                        fill="#fff"
                    />
                </svg>
            </div>
        </div>

        <p class="contact-title">Contatos</p>

        <div class="contacts">
            <div class="contact" v-for="c in contacts">
                <div class="fav" @click="toggleFavorite(c)">
                    <svg
                        height="800px"
                        width="800px"
                        stroke-width="3"
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 47.94 47.94"
                        xml:space="preserve"
                    >
                        <path
                            style="fill: transparent"
                            stroke="#0A2342"
                            d="M26.285,2.486l5.407,10.956c0.376,0.762,1.103,1.29,1.944,1.412l12.091,1.757
                        c2.118,0.308,2.963,2.91,1.431,4.403l-8.749,8.528c-0.608,0.593-0.886,1.448-0.742,2.285l2.065,12.042
                        c0.362,2.109-1.852,3.717-3.746,2.722l-10.814-5.685c-0.752-0.395-1.651-0.395-2.403,0l-10.814,5.685
                        c-1.894,0.996-4.108-0.613-3.746-2.722l2.065-12.042c0.144-0.837-0.134-1.692-0.742-2.285l-8.749-8.528
                        c-1.532-1.494-0.687-4.096,1.431-4.403l12.091-1.757c0.841-0.122,1.568-0.65,1.944-1.412l5.407-10.956
                        C22.602,0.567,25.338,0.567,26.285,2.486z"
                        />
                    </svg>
                </div>

                <div class="picture">
                    <img src="https://picsum.photos/200" />
                </div>

                <p class="nome">{{ c.pessoa.nome }}</p>

                <div class="info">
                    <a href="mailto:{{ c.email }}" class="email">
                        {{ c.email }}
                    </a>

                    <p>
                        {{ c.telefone }}
                    </p>
                </div>

                <div class="actions">
                    <svg
                        width="800px"
                        height="800px"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        class="edit"
                        @click="openModal(c)"
                    >
                        <title />
                        <g id="Complete">
                            <g id="edit">
                                <g>
                                    <path
                                        d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
                                        fill="none"
                                        stroke="#0A2342"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                    />
                                    <polygon
                                        fill="none"
                                        points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
                                        stroke="#0A2342"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                    />
                                </g>
                            </g>
                        </g>
                    </svg>

                    <svg
                        width="800px"
                        height="800px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon"
                        @click="deleteContact(c)"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M10.3094 2.25002H13.6908C13.9072 2.24988 14.0957 2.24976 14.2737 2.27819C14.977 2.39049 15.5856 2.82915 15.9146 3.46084C15.9978 3.62073 16.0573 3.79961 16.1256 4.00494L16.2373 4.33984C16.2562 4.39653 16.2616 4.41258 16.2661 4.42522C16.4413 4.90933 16.8953 5.23659 17.4099 5.24964C17.4235 5.24998 17.44 5.25004 17.5001 5.25004H20.5001C20.9143 5.25004 21.2501 5.58582 21.2501 6.00004C21.2501 6.41425 20.9143 6.75004 20.5001 6.75004H3.5C3.08579 6.75004 2.75 6.41425 2.75 6.00004C2.75 5.58582 3.08579 5.25004 3.5 5.25004H6.50008C6.56013 5.25004 6.5767 5.24998 6.59023 5.24964C7.10488 5.23659 7.55891 4.90936 7.73402 4.42524C7.73863 4.41251 7.74392 4.39681 7.76291 4.33984L7.87452 4.00496C7.94281 3.79964 8.00233 3.62073 8.08559 3.46084C8.41453 2.82915 9.02313 2.39049 9.72643 2.27819C9.90445 2.24976 10.093 2.24988 10.3094 2.25002ZM9.00815 5.25004C9.05966 5.14902 9.10531 5.04404 9.14458 4.93548C9.1565 4.90251 9.1682 4.86742 9.18322 4.82234L9.28302 4.52292C9.37419 4.24941 9.39519 4.19363 9.41601 4.15364C9.52566 3.94307 9.72853 3.79686 9.96296 3.75942C10.0075 3.75231 10.067 3.75004 10.3553 3.75004H13.6448C13.9331 3.75004 13.9927 3.75231 14.0372 3.75942C14.2716 3.79686 14.4745 3.94307 14.5842 4.15364C14.605 4.19363 14.626 4.2494 14.7171 4.52292L14.8169 4.82216L14.8556 4.9355C14.8949 5.04405 14.9405 5.14902 14.992 5.25004H9.00815Z"
                            fill="#1C274C"
                        />
                        <path
                            d="M5.91509 8.45015C5.88754 8.03685 5.53016 7.72415 5.11686 7.7517C4.70357 7.77925 4.39086 8.13663 4.41841 8.54993L4.88186 15.5017C4.96736 16.7844 5.03642 17.8205 5.19839 18.6336C5.36679 19.4789 5.65321 20.185 6.2448 20.7385C6.8364 21.2919 7.55995 21.5308 8.4146 21.6425C9.23662 21.7501 10.275 21.7501 11.5606 21.75H12.4395C13.7251 21.7501 14.7635 21.7501 15.5856 21.6425C16.4402 21.5308 17.1638 21.2919 17.7554 20.7385C18.347 20.185 18.6334 19.4789 18.8018 18.6336C18.9638 17.8206 19.0328 16.7844 19.1183 15.5017L19.5818 8.54993C19.6093 8.13663 19.2966 7.77925 18.8833 7.7517C18.47 7.72415 18.1126 8.03685 18.0851 8.45015L17.6251 15.3493C17.5353 16.6971 17.4713 17.6349 17.3307 18.3406C17.1943 19.025 17.004 19.3873 16.7306 19.6431C16.4572 19.8989 16.083 20.0647 15.391 20.1552C14.6776 20.2485 13.7376 20.25 12.3868 20.25H11.6134C10.2626 20.25 9.32255 20.2485 8.60915 20.1552C7.91715 20.0647 7.54299 19.8989 7.26958 19.6431C6.99617 19.3873 6.80583 19.025 6.66948 18.3406C6.52892 17.6349 6.46489 16.6971 6.37503 15.3493L5.91509 8.45015Z"
                            fill="#1C274C"
                        />
                        <path
                            d="M9.42546 10.2538C9.83762 10.2125 10.2052 10.5133 10.2464 10.9254L10.7464 15.9254C10.7876 16.3376 10.4869 16.7051 10.0747 16.7463C9.66256 16.7875 9.29503 16.4868 9.25381 16.0747L8.75381 11.0747C8.7126 10.6625 9.01331 10.295 9.42546 10.2538Z"
                            fill="#1C274C"
                        />
                        <path
                            d="M14.5747 10.2538C14.9869 10.295 15.2876 10.6625 15.2464 11.0747L14.7464 16.0747C14.7052 16.4868 14.3376 16.7875 13.9255 16.7463C13.5133 16.7051 13.2126 16.3376 13.2538 15.9254L13.7538 10.9254C13.795 10.5133 14.1626 10.2125 14.5747 10.2538Z"
                            fill="#1C274C"
                        />
                    </svg>
                </div>
            </div>

            <p v-if="contacts.length == 0">Nenhum contato encontrado!</p>
        </div>

        <div class="add-contact">
            <router-link class="common-button" to="/adicionar-contato">
                <p>Adicionar contato</p></router-link
            >
        </div>

        <Footer></Footer>

        <modal v-if="modalActive">
            <EditContact
                v-bind="currentContact"
                @close="modalActive = false"
            ></EditContact>
        </modal>
    </div>
</template>

<style lang="scss">
@import "../scss/app.scss";
@import "../scss/home.scss";
</style>
