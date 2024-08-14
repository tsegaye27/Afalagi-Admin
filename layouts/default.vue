<template>
  <div class="bg-[#fafafb] h-screen">
    <TopBar class="bg-white" />
    <hr />
    <div class="flex gap-12">
      <Sidebar />
      <slot />
    </div>
  </div>
</template>
