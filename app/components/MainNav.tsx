"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { faqNavItems } from "../constants";

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleFaqItemClick = (href: string) => {
    // If we're already on the FAQ page, manually trigger the hash change
    if (pathname === '/faq') {
      const hash = href.split('#')[1];
      window.location.hash = hash;
    } else {
      router.push(href);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="flex h-16 items-center space-x-8">
          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium flex items-center"
          >

          <svg width="45" height="469" viewBox="0 0 469 469" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M325.449 162.737C324.369 163.817 324.276 165.532 325.199 166.748C334.501 179.002 341.37 193.204 345.087 208.635C345.402 209.943 346.529 210.887 347.86 211.081C356.26 212.304 363.324 217.543 366.955 224.743C367.506 225.834 368.59 226.584 369.812 226.584H389.194C390.913 226.584 392.283 225.141 392.158 223.426C389.73 190.229 377.012 159.891 357.181 135.585C356.073 134.227 354.039 134.147 352.8 135.386L325.449 162.737ZM318.837 226.584C319.767 226.584 320.595 226.015 320.997 225.177C323.925 219.075 329.297 214.322 335.876 212.131C337.475 211.599 338.536 209.984 338.112 208.354C334.662 195.088 328.727 182.825 320.833 172.092C319.767 170.643 317.666 170.519 316.394 171.791L303.254 184.932C302.209 185.977 302.086 187.624 302.919 188.844C310.042 199.275 314.833 211.425 316.542 224.542C316.693 225.701 317.669 226.584 318.837 226.584V226.584ZM298.607 194.515C297.605 192.949 295.42 192.766 294.106 194.08L284.708 203.478C283.72 204.466 283.553 206.001 284.243 207.216C287.173 212.372 289.314 218.035 290.504 224.04C290.792 225.496 292.045 226.584 293.529 226.584H306.653C308.446 226.584 309.843 225.021 309.56 223.251C307.89 212.806 304.085 203.073 298.607 194.515Z" fill="url(#paint0_linear_51_922)"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M332.9 297.892C331.566 296.977 331.201 295.171 332.035 293.785C337.73 284.329 342.086 273.976 344.84 262.988C345.166 261.684 346.302 260.75 347.633 260.568C356.287 259.386 363.55 253.947 367.151 246.478C367.691 245.358 368.79 244.583 370.033 244.583H389.118C390.845 244.583 392.218 246.038 392.081 247.759C390.018 273.661 381.689 297.797 368.609 318.652C367.715 320.076 365.815 320.45 364.428 319.499L332.9 297.892ZM318.687 244.583C319.597 244.583 320.404 245.148 320.78 245.976C323.625 252.233 329.014 257.133 335.659 259.412C337.253 259.959 338.3 261.584 337.861 263.211C335.31 272.662 331.494 281.595 326.606 289.815C325.738 291.275 323.816 291.666 322.415 290.706L307.276 280.331C305.954 279.424 305.583 277.641 306.38 276.25C311.524 267.268 315.027 257.225 316.482 246.531C316.632 245.424 317.569 244.583 318.687 244.583V244.583ZM296.757 273.121C298.172 274.091 300.116 273.681 300.953 272.183C305.086 264.777 308.012 256.606 309.467 247.936C309.764 246.16 308.365 244.583 306.564 244.583H293.322C291.859 244.583 290.617 245.641 290.308 247.071C289.196 252.222 287.381 257.111 284.969 261.633C284.222 263.032 284.599 264.789 285.907 265.685L296.757 273.121Z" fill="url(#paint1_linear_51_922)"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M305.745 327.538C304.805 326.225 305.075 324.408 306.327 323.389C313.047 317.921 319.129 311.699 324.444 304.852C325.436 303.575 327.251 303.265 328.585 304.179L360.084 325.766C361.477 326.721 361.81 328.638 360.792 329.985C352.541 340.898 342.901 350.702 332.137 359.135C330.81 360.174 328.892 359.878 327.911 358.508L305.745 327.538ZM302.596 317.789C301.282 318.871 299.336 318.585 298.346 317.2L287.662 302.274C286.732 300.974 286.988 299.177 288.205 298.141C292.073 294.846 295.632 291.201 298.835 287.255C299.845 286.01 301.641 285.713 302.963 286.619L318.101 296.993C319.502 297.954 319.83 299.888 318.781 301.224C313.999 307.313 308.569 312.869 302.596 317.789ZM284.512 292.446C283.215 293.577 281.24 293.301 280.238 291.902L272.503 281.094C271.582 279.808 271.824 278.035 272.996 276.974C274.557 275.561 276.039 274.062 277.433 272.484C278.474 271.306 280.229 271.038 281.525 271.926L292.444 279.41C293.86 280.38 294.179 282.342 293.083 283.663C290.467 286.816 287.599 289.754 284.512 292.446Z" fill="url(#paint2_linear_51_922)"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M299.567 332.009C298.623 330.691 296.805 330.364 295.436 331.232C277.882 342.363 257.063 348.808 234.739 348.808C219.644 348.808 205.238 345.862 192.064 340.513C190.57 339.906 188.849 340.541 188.148 341.993L171.762 375.968C171.029 377.488 171.691 379.316 173.243 379.979C192.228 388.092 213.131 392.582 235.083 392.582C266.754 392.582 296.242 383.235 320.939 367.146C322.351 366.226 322.689 364.314 321.708 362.944L299.567 332.009ZM292.17 321.674C293.156 323.052 292.808 324.977 291.372 325.877C274.955 336.165 255.541 342.112 234.739 342.112C220.77 342.112 207.428 339.43 195.199 334.554C193.616 333.923 192.932 332.076 193.672 330.541L201.651 313.999C202.344 312.562 204.038 311.924 205.53 312.489C214.61 315.927 224.455 317.809 234.739 317.809C250.345 317.809 264.939 313.476 277.383 305.947C278.758 305.115 280.555 305.447 281.491 306.754L292.17 321.674ZM274.07 296.386C275.066 297.778 274.701 299.724 273.228 300.595C261.947 307.259 248.79 311.084 234.739 311.084C225.618 311.084 216.874 309.472 208.775 306.519C207.155 305.928 206.445 304.059 207.194 302.505L213.144 290.17C213.826 288.754 215.483 288.114 216.971 288.617C222.657 290.54 228.748 291.582 235.083 291.582C244.926 291.582 254.179 289.067 262.238 284.642C263.619 283.883 265.368 284.229 266.285 285.51L274.07 296.386Z" fill="url(#paint3_linear_51_922)"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M144.601 331.609C145.603 330.607 147.16 330.466 148.435 331.085C151.041 332.351 153.977 333.063 157.083 333.063C161.116 333.063 164.864 331.863 167.973 329.806C169.109 329.055 170.595 328.968 171.727 329.725C174.391 331.507 177.135 333.178 179.952 334.734C181.372 335.518 181.959 337.271 181.254 338.733L164.884 372.675C164.152 374.192 162.315 374.812 160.831 374.017C149.298 367.841 138.624 360.271 129.034 351.531C127.786 350.394 127.762 348.448 128.956 347.254L144.601 331.609ZM174.916 301.294C173.884 302.326 173.769 303.941 174.446 305.235C175.812 307.847 176.583 310.808 176.583 313.946C176.583 316.351 176.13 318.653 175.303 320.773C174.737 322.223 175.1 323.937 176.403 324.788C178.457 326.129 180.559 327.402 182.707 328.603C184.186 329.429 186.04 328.811 186.775 327.286L194.745 310.761C195.445 309.311 194.872 307.572 193.478 306.766C189.312 304.355 185.377 301.59 181.712 298.513C180.491 297.487 178.68 297.53 177.552 298.658L174.916 301.294ZM186.573 289.637C185.354 290.856 185.408 292.854 186.741 293.947C189.712 296.382 192.871 298.595 196.193 300.561C197.663 301.431 199.541 300.817 200.283 299.279L206.242 286.925C206.93 285.498 206.385 283.788 205.044 282.945C203.447 281.941 201.905 280.859 200.421 279.705C199.182 278.741 197.409 278.801 196.299 279.911L186.573 289.637Z" fill="url(#paint4_linear_51_922)"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M132.142 290.303C133.59 289.594 135.335 290.158 136.135 291.557C137.665 294.234 139.301 296.842 141.037 299.376C141.831 300.536 141.729 302.078 140.929 303.234C138.817 306.289 137.583 309.976 137.583 313.946C137.583 316.99 138.309 319.868 139.599 322.422C140.25 323.709 140.125 325.3 139.105 326.32L123.535 341.89C122.346 343.079 120.409 343.06 119.269 341.824C110.67 332.498 103.182 322.131 97.017 310.933C96.2019 309.453 96.809 307.601 98.327 306.858L132.142 290.303ZM142.283 288.812C141.427 287.337 142.03 285.461 143.562 284.712L160.054 276.637C161.487 275.936 163.213 276.481 164.037 277.848C166.447 281.844 169.186 285.619 172.216 289.136C173.268 290.356 173.236 292.188 172.097 293.327L169.279 296.145C168.289 297.135 166.756 297.285 165.489 296.691C162.944 295.497 160.093 294.828 157.083 294.828C154.619 294.828 152.262 295.276 150.091 296.094C148.674 296.628 147.017 296.269 146.17 295.015C144.806 292.995 143.509 290.927 142.283 288.812ZM170.276 275.159C169.368 273.693 169.965 271.785 171.514 271.027L183.89 264.967C185.297 264.278 186.991 264.793 187.852 266.102C188.835 267.597 189.888 269.042 191.005 270.433C192 271.672 191.954 273.47 190.831 274.593L181.11 284.314C179.903 285.521 177.928 285.483 176.826 284.178C174.431 281.343 172.24 278.329 170.276 275.159Z" fill="#02C8A1"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M118.845 244.583C120.408 244.583 121.705 245.783 121.869 247.338C123.06 258.647 125.912 269.461 130.177 279.532C130.81 281.026 130.188 282.768 128.73 283.482L94.9239 300.033C93.4145 300.772 91.5898 300.129 90.9115 298.591C83.9601 282.833 79.5163 265.72 78.0859 247.759C77.9488 246.038 79.3218 244.583 81.0487 244.583H118.845ZM128.662 247.835C128.458 246.089 129.843 244.583 131.601 244.583H150.071C151.599 244.583 152.877 245.732 153.096 247.244C154.037 253.739 155.735 259.988 158.097 265.901C158.694 267.396 158.07 269.117 156.624 269.825L140.145 277.894C138.624 278.638 136.785 277.979 136.133 276.417C132.388 267.444 129.832 257.851 128.662 247.835ZM160.011 247.936C159.713 246.16 161.113 244.583 162.914 244.583H176.844C178.307 244.583 179.549 245.641 179.858 247.072C180.392 249.543 181.087 251.954 181.933 254.293C182.473 255.788 181.847 257.477 180.42 258.176L168.074 264.22C166.54 264.971 164.683 264.293 164.066 262.7C162.238 257.989 160.869 253.049 160.011 247.936Z" fill="#02C8A1"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M136.635 172.629C137.971 173.544 138.335 175.352 137.498 176.739C129.046 190.741 123.533 206.718 121.814 223.813C121.657 225.374 120.357 226.583 118.788 226.583H80.9723C79.2528 226.583 77.8825 225.14 78.008 223.425C79.9143 197.37 88.159 173.075 101.207 152.076C102.097 150.644 104.003 150.265 105.394 151.218L136.635 172.629ZM142.931 180.703C143.8 179.245 145.72 178.855 147.12 179.814L162.257 190.189C163.581 191.096 163.951 192.882 163.152 194.273C158.008 203.228 154.496 213.239 153.021 223.902C152.811 225.423 151.529 226.583 149.993 226.583H131.539C129.787 226.583 128.404 225.087 128.598 223.346C130.319 207.897 135.337 193.443 142.931 180.703ZM168.582 198.332C169.42 196.837 171.362 196.429 172.776 197.398L183.954 205.059C185.252 205.948 185.634 207.684 184.909 209.08C182.496 213.726 180.71 218.75 179.662 224.04C179.373 225.496 178.121 226.583 176.637 226.583H162.824C161.032 226.583 159.635 225.021 159.918 223.251C161.344 214.329 164.328 205.927 168.582 198.332Z" fill="url(#paint5_linear_51_922)"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M188.212 198.731C189.519 199.627 191.29 199.346 192.326 198.148C193.77 196.478 195.311 194.893 196.939 193.402C198.1 192.339 198.335 190.575 197.418 189.295L189.614 178.391C188.617 176.998 186.654 176.717 185.355 177.834C182.149 180.592 179.176 183.613 176.47 186.864C175.371 188.184 175.689 190.149 177.106 191.12L188.212 198.731ZM181.636 172.168C182.865 171.134 183.128 169.329 182.193 168.023L178.181 162.418C177.369 161.283 175.886 160.885 174.536 161.239C173.115 161.61 171.623 161.809 170.083 161.809C167.305 161.809 164.681 161.164 162.357 160.018C161.076 159.386 159.499 159.493 158.498 160.513C155.766 163.298 153.185 166.231 150.769 169.301C149.717 170.637 150.044 172.573 151.447 173.535L166.586 183.91C167.907 184.815 169.701 184.52 170.712 183.278C173.997 179.24 177.656 175.52 181.636 172.168ZM155.888 135.367C156.713 134.192 156.847 132.611 156.012 131.443L141.996 111.861C141.014 110.489 139.092 110.194 137.765 111.238C126.934 119.761 117.248 129.674 108.977 140.709C107.967 142.056 108.303 143.966 109.692 144.918L140.961 166.349C142.295 167.262 144.108 166.953 145.101 165.677C147.81 162.194 150.719 158.873 153.808 155.731C154.812 154.71 154.964 153.138 154.367 151.836C153.401 149.727 152.863 147.388 152.863 144.926C152.863 141.378 153.98 138.085 155.888 135.367Z" fill="url(#paint6_linear_51_922)"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M196.694 169.762C195.208 170.626 194.835 172.582 195.835 173.98L203.591 184.817C204.512 186.104 206.271 186.446 207.654 185.676C212.42 183.025 217.609 181.043 223.094 179.858C224.525 179.549 225.584 178.307 225.584 176.844V163.464C225.584 161.665 224.01 160.266 222.235 160.56C213.059 162.084 204.441 165.256 196.694 169.762ZM222.918 153.649C224.432 153.432 225.584 152.153 225.584 150.624V132.157C225.584 130.4 224.079 129.016 222.334 129.218C210.463 130.591 199.186 133.91 188.829 138.848C187.505 139.479 186.9 140.992 187.118 142.442C187.24 143.253 187.303 144.082 187.303 144.926C187.303 148.34 186.27 151.516 184.493 154.172C183.711 155.341 183.6 156.886 184.419 158.029L188.411 163.608C189.343 164.91 191.129 165.245 192.503 164.425C201.645 158.966 211.932 155.225 222.918 153.649ZM222.825 122.426C224.381 122.264 225.584 120.967 225.584 119.402V81.0487C225.584 79.3218 224.128 77.9488 222.407 78.0859C195.435 80.234 170.377 89.177 148.947 103.203C147.539 104.124 147.202 106.033 148.182 107.402L162.438 127.319C163.233 128.431 164.675 128.837 166.005 128.52C167.312 128.209 168.678 128.044 170.083 128.044C174.534 128.044 178.59 129.699 181.647 132.417C182.684 133.339 184.172 133.658 185.422 133.054C196.94 127.488 209.542 123.812 222.825 122.426Z" fill="url(#paint7_linear_51_922)"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M243.583 176.637C243.583 178.121 244.67 179.374 246.126 179.662C253.278 181.079 259.945 183.846 265.85 187.687C267.081 188.487 268.713 188.36 269.751 187.322L279.047 178.026C280.319 176.753 280.195 174.65 278.73 173.604C269.463 166.985 258.642 162.402 246.921 160.508C245.149 160.221 243.583 161.619 243.583 163.413V176.637ZM243.583 150.58C243.583 152.114 244.742 153.395 246.261 153.607C260.322 155.572 273.247 161.081 284.105 169.202C285.329 170.118 287.046 170.027 288.126 168.946L301.185 155.888C302.428 154.645 302.343 152.602 300.964 151.511C285.735 139.459 267.143 131.47 246.825 129.181C245.082 128.985 243.583 130.368 243.583 132.122V150.58ZM243.583 119.37C243.583 120.938 244.791 122.237 246.351 122.395C268.871 124.684 289.446 133.556 306.118 147.058C307.332 148.042 309.099 147.974 310.204 146.869L337.465 119.608C338.686 118.387 338.629 116.39 337.317 115.269C312.569 94.1323 281.194 80.5288 246.741 78.008C245.027 77.8825 243.583 79.2528 243.583 80.9723V119.37Z" fill="url(#paint8_linear_51_922)"/>
          <path opacity="0.9" d="M372.001 105.974L366.639 100.611L231.672 235.578L237.035 240.94L372.001 105.974Z" fill="white"/>
          <circle cx="367.809" cy="102.809" r="18" fill="white"/>
          <circle cx="235.309" cy="235.309" r="36.5" fill="white"/>
          <circle cx="344.161" cy="236.105" r="17.25" fill="white"/>
          <circle cx="157.143" cy="314.173" r="13.1912" fill="white"/>
          <circle cx="170.136" cy="145.127" r="11.6488" fill="white"/>
          <defs>
          <linearGradient id="paint0_linear_51_922" x1="349.013" y1="134.235" x2="370.775" y2="234.049" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF003F"/>
          <stop offset="1" stopColor="#B73F6F"/>
          </linearGradient>
          <linearGradient id="paint1_linear_51_922" x1="336" y1="239" x2="321.627" y2="282.043" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D92F5F"/>
          <stop offset="1" stopColor="#8F6C87"/>
          </linearGradient>
          <linearGradient id="paint2_linear_51_922" x1="286" y1="379" x2="348.495" y2="323.995" gradientUnits="userSpaceOnUse">
          <stop stopColor="#33A190"/>
          <stop offset="1" stopColor="#8F6C83"/>
          </linearGradient>
          <linearGradient id="paint3_linear_51_922" x1="179.723" y1="340.791" x2="274.9" y2="287.82" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00CAA6"/>
          <stop offset="0.538375" stopColor="#05C6A4"/>
          <stop offset="1" stopColor="#6B8088"/>
          </linearGradient>
          <linearGradient id="paint4_linear_51_922" x1="128.11" y1="347.834" x2="163.732" y2="372.582" gradientUnits="userSpaceOnUse">
          <stop stopColor="#02C8A1"/>
          <stop offset="1" stopColor="#00CAA5"/>
          </linearGradient>
          <linearGradient id="paint5_linear_51_922" x1="147.736" y1="171.687" x2="131.783" y2="226.626" gradientUnits="userSpaceOnUse">
          <stop stopColor="#04C49C"/>
          <stop offset="1" stopColor="#03C69F"/>
          </linearGradient>
          <linearGradient id="paint6_linear_51_922" x1="176.3" y1="154.903" x2="154.374" y2="176.841" gradientUnits="userSpaceOnUse">
          <stop stopColor="#04C299"/>
          <stop offset="1" stopColor="#04C39B"/>
          </linearGradient>
          <linearGradient id="paint7_linear_51_922" x1="225.805" y1="136.354" x2="181.944" y2="153.53" gradientUnits="userSpaceOnUse">
          <stop stopColor="#05BE95"/>
          <stop offset="1" stopColor="#04C299"/>
          </linearGradient>
          <linearGradient id="paint8_linear_51_922" x1="296.049" y1="161.66" x2="243.746" y2="141.518" gradientUnits="userSpaceOnUse">
          <stop stopColor="#06BA91"/>
          <stop offset="1" stopColor="#06BC94"/>
          </linearGradient>
          </defs>
          </svg>

          <span className="text-xl font-bold">oasdiff</span>
          </Link>
          <div className="relative group">
            <div className="flex items-center gap-1">
              <Link
                href="/faq"
                className={`${
                  pathname === "/faq"
                    ? "text-emerald-400"
                    : "text-gray-300 hover:text-emerald-300"
                } transition-colors font-medium`}
              >
                FAQ
              </Link>
              <button
                className={`${
                  pathname === "/faq"
                    ? "text-emerald-400"
                    : "text-gray-300 hover:text-emerald-300"
                } transition-colors`}
                aria-label="Toggle FAQ menu"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
            <div className="absolute top-full left-0 mt-1 py-2 w-64 bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {faqNavItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleFaqItemClick(item.href)}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-emerald-400 hover:bg-gray-800/50"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <Link
            href="/diff-calculator"
            className={`${
              pathname === "/diff-calculator"
                ? "text-emerald-400"
                : "text-gray-300 hover:text-emerald-300"
            } transition-colors font-medium`}
          >
            Diff Calculator
          </Link>
          <Link
            href="/checks"
            className={`${
              pathname === "/checks"
                ? "text-emerald-400"
                : "text-gray-300 hover:text-emerald-300"
            } transition-colors font-medium`}
          >
            Checks
          </Link>
        </div>
      </div>
    </nav>
  );
} 