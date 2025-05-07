<template>
    <div class="w-full max-w-sm p-6 bg-white rounded-xl shadow-md space-y-4">
        <div>
            <UInput placeholder="Username" v-model="userForm.username" />
        </div>
        <div>
            <UInput placeholder="Password" v-model="userForm.password" type="password" />
        </div>
        <div>
            <UButton block @click="loginAction">Login</UButton>
        </div>
    </div>
</template>

<script setup>
const userForm = reactive({
    username: null,
    password: null
})

const { login, token, fetchUser } = useAuth()

if (token) {
    navigateTo("/")
}

const loginAction = async () => {
    await login(userForm)
    await fetchUser()
    await navigateTo("/")
}
</script>