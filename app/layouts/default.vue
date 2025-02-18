<template>
    <div>
        <StructuresAppHeader class="fixed z-50" />
        <div>
            <main class="bg-neutral-950 min-h-screen text-white pt-20 pb-10">
                <slot />
            </main>
        </div>

        <StructuresAppFooter />
    </div>
</template>