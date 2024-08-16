<template>
  <div class="bg-[#fafafb] h-screen">
    <TopBar class="bg-white" />
    <hr />
    <div class="flex gap-28">
      <Sidebar />
      <div class="overflow-auto">
        <slot />
      </div>
    </div>
  </div>
</template>
