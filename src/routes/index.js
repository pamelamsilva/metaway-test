import { createRouter, createWebHistory } from "vue-router";

const routes = [
    { path: "/", component: () => import("../components/Home.vue") },
    { path: "/login", component: () => import("../components/Login.vue") },
    {
        path: "/adicionar-contato",
        component: () => import("../components/NewContact.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
