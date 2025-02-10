<script setup lang="ts">
import { ref } from 'vue'
const submitted = ref(false)
const submitHandler = async () => {
    // Let's pretend this is an ajax request:
    await new Promise((r) => setTimeout(r, 1000))
    submitted.value = true
}
</script>

<template>
    <section class="w-full h-screen flex items-center justify-center">
        <div class="flex flex-col items-center justify-center w-1/2 h-fit  bg-neutral-900 p-10 rounded-xl">
            <FormKit id="registration-example" #default="{ value }" type="form"
                :form-class="submitted ? 'hide' : 'show'" submit-label="Register" :actions="false"
                @submit="submitHandler">
                <h1 class="text-2xl font-bold mb-10 text-white text-center">S'incrire</h1>
                <FormKit type="text" name="name" label="Nom" placeholder="Votre nom" validation="required" />
                <FormKit type="text" name="email" label="Email" placeholder="jane@exemple.com"
                    validation="required|email" />
                <div class="double">
                    <FormKit type="password" name="password" label="Mot de passe"
                        validation="required|length:6|matches:/[^a-zA-Z]/" :validation-messages="{
                            matches: 'Please include at least one symbol',
                        }" placeholder="Votre mot de passe" />
                    <FormKit type="password" name="password_confirm" label="Validez le mot de passe"
                        placeholder="Votre mot de passe" validation="required|confirm" />
                </div>

                <FormKit type="submit" label="S'inscrire" />
            </FormKit>
            <div v-if="submitted">
                <h2 class="text-xl text-green-500">Submission successful!</h2>
            </div>
        </div>
    </section>


</template>