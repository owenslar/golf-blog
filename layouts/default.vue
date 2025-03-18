<template>
    <div>
        <header>
            <nav>
                <NuxtLink to="/">Golf Blog</NuxtLink>
                <ul>
                    <li><NuxtLink to="/">Home</NuxtLink></li>
                    <li><NuxtLink to="/about">About</NuxtLink></li>
                    <li><NuxtLink to="/blogs">Blogs</NuxtLink></li>
                </ul>
            </nav>
        </header>
        <div>
            <slot />
        </div>
    </div>
</template>