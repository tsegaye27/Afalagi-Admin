<template>
  <div class="w-full py-5 px-10 flex justify-between">
    <div class="search relative flex items-center w-[57%]">
      <input
        class="outline-none border relative text-[var(--primary-color)] border-[var(--secondary-color)] w-full rounded-md py-1 pl-[3rem]"
        placeholder="Type to search"
        type="text"
      />
      <span class="absolute text-[var(--secondary-color)] top-2 left-4"
        ><Icon name="material-symbols:search-rounded" size="20px"
      /></span>
    </div>
    <div class="flex px-4 justify-center gap-5 items-center w-1/7">
      <span class="flex justify-center items-center"
        ><Icon
          name="material-symbols-light:mail-outline"
          class="text-[var(--secondary-color)]"
          size="26px"
      /></span>
      <span class="flex items-center"
        ><Icon
          name="tabler:bell"
          class="text-[var(--secondary-color)]"
          size="26px"
      /></span>
      <span
        class="bg-[var(--primary-color)] px-[0.75rem] py-[0.3rem] text-white rounded-full flex justify-center items-center"
        >T</span
      >
      <!-- <img src="" alt=""> -->
    </div>
  </div>
</template>
