<template>
  <div class="sidebar w-[15rem] h-[42rem]">
    <ul class="flex flex-col items-start p-8 h-full justify-between gap-5">
      <div class="flex flex-col gap-4">
        <li class="cursor-pointer flex gap-2 items-center">
          <span class="flex text-[var(--secondary-color)]"
            ><Icon name="ph:house" size="18px" /></span
          ><span class="flex text-[var(--primary-color)]">Dashboard</span>
        </li>
        <li class="cursor-pointer flex gap-2 items-center">
          <span class="flex text-[var(--secondary-color)]"
            ><Icon name="prime:users" size="19px" /></span
          ><span class="flex text-[var(--primary-color)]">Users </span>
        </li>
        <li class="cursor-pointer flex gap-2 items-center">
          <span class="flex text-[var(--secondary-color)]"
            ><Icon name="ph:files" size="19px" /></span
          ><span class="flex text-[var(--primary-color)]">Posts </span>
        </li>
        <li class="cursor-pointer flex gap-2 items-center">
          <span class="flex text-[var(--secondary-color)]"
            ><Icon name="ph:files" size="19px" /></span
          ><span class="flex text-[var(--primary-color)]">Files </span>
        </li>
        <li class="cursor-pointer flex gap-2 items-center">
          <span class="flex text-[var(--secondary-color)]"
            ><Icon name="iconoir:reports" size="19px" /></span
          ><span class="flex text-[var(--primary-color)]">Analytics </span>
        </li>
        <li class="cursor-pointer flex gap-2 items-center">
          <span class="flex text-[var(--secondary-color)]"
            ><Icon name="ph:activity-light" size="19px" /></span
          ><span class="flex text-[var(--primary-color)]">Activity </span>
        </li>
      </div>
      <div class="flex flex-col gap-4">
        <li class="cursor-pointer flex gap-2 items-center">
          <span class="flex text-[var(--secondary-color)]"
            ><Icon
              name="material-symbols:person-edit-outline-sharp"
              size="19px" /></span
          ><span class="flex text-[var(--primary-color)]">Profile </span>
        </li>
        <li class="cursor-pointer flex gap-2 items-center">
          <span class="flex text-[var(--secondary-color)]"
            ><Icon name="material-symbols:settings-outline" size="19px" /></span
          ><span class="flex text-[var(--primary-color)]">Settings </span>
        </li>
        <li class="cursor-pointer flex gap-2 items-center">
          <span class="flex text-[var(--secondary-color)]"
            ><Icon name="material-symbols:logout-sharp" size="19px" /></span
          ><span class="flex text-[var(--primary-color)]">Logout </span>
        </li>
      </div>
    </ul>
  </div>
</template>
