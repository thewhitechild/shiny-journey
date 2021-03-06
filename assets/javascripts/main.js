import dotenv from "dotenv";

dotenv.config();

const pulls = document.querySelector(".header__pri-nav-item:first-child");
const headerSearch = document.querySelector(".header__search");
const mainHeader = document.querySelector(".main__header");
const primaryNav = document.querySelector(".header__pri-nav");
const hamburgerMenu = document.querySelector(".header__hamburger-menu");
const mainResults = document.querySelector(".main__results");
const repoCount = document.querySelector(".main__repo-count");
const accessToken = process.env.GH_ACCESS_TOKEN;
const apiEndpoint = process.env.API_ENDPOINT;
const query = `
    query {
      viewer {
        name
         repositories(last: 20) {
           totalCount 
           nodes {
            name
            description
            forkCount
            stargazerCount
            isPrivate
            updatedAt
            languages(last: 20) {
              nodes {
                name
                color
              }
            }
           }
         }
       }
    }
`

// Get user and repo details from Github.
async function getRepoUserData(apiEndpoint, accessToken) {
    const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${ accessToken }`
        },
        body: JSON.stringify({ query }),
    });

    return response.json();
}

// Update page with user and repo details.
function updateRepoUserData(repoUserData) {
    console.log(repoUserData.data.viewer.repositories.nodes)
    for (let repo of repoUserData.data.viewer.repositories.nodes.reverse()) {
        function renderRepoLanguages() {
            let languages = "";
            for (let language of repo.languages.nodes) {
               languages += `
                <span class="main__repo-language"><i style="color: ${language.color}" class="fas fa-circle"></i> ${language.name}</span>
               ` ;
            }
            return languages;
        }

        const options = { year: "numeric", month: "long", day: "numeric" };
        const fmtUpdatedAtDate = new Date(repo.updatedAt).toLocaleDateString(undefined, options);
        const mainResult = `
            <div class="main__result">
                <div class="main__result-name">
                    <span class="main__repo-name">${repo.name} ${repo.isPrivate ? '<span class="main__private">Private</span>' : ""}</span>
                    <button class="main__repo-star-btn"><i class="far fa-star"></i> Star</button>
                </div>
                <div class="main__result-details">
                    ${renderRepoLanguages()}
                    <span class="main__repo-stars"><i class="far fa-star"></i> ${repo.stargazerCount}</span>
                    <span class="main__repo-forks"><i class="fas fa-code-branch"></i> ${repo.forkCount}</span>
                    <span class="main__repo-updated-date">${fmtUpdatedAtDate}</span>
                </div>
            </div>
        `;

        mainResults.innerHTML += mainResult;
    }
    repoCount.innerText = repoUserData.data.viewer.repositories.totalCount;
}

// Get user and repo details from api endpoint.
getRepoUserData(apiEndpoint, accessToken)
    .then(data => {
        console.log(data);
        console.log(data.data.viewer.repositories.nodes);
        updateRepoUserData(data);
    })

// Changes "Pull requests" to "Pulls"
window.addEventListener('resize', () => {
    if (window.innerWidth <= 910 && window.innerWidth > 850) {
        pulls.innerText = "Pulls";
    } else if (window.innerWidth <= 850) {
        pulls.innerText = "Pull requests"
    } else {
        pulls.innerText = "Pull requests"
    }
});

// Toggle mobile menu
let isMenu = false;
hamburgerMenu.addEventListener('click', () => {
   if (!isMenu) {
       headerSearch.style.display = "block";
       primaryNav.style.display = "block";
       isMenu = true;
   } else {
       headerSearch.style.display = "none";
       primaryNav.style.display = "none";
       isMenu = false;
   }
});

// Main Header onScroll Effect
window.addEventListener('scroll', function() {
    if (window.innerWidth > 850 && window.pageYOffset > 84) {
        mainHeader.style.position = "fixed";
        mainHeader.style.top = "0";
    } else if (window.pageYOffset < 84 && window.innerWidth > 850) {
        mainHeader.style.position = "absolute";
        mainHeader.style.top = "6rem";
    } else if (window.innerWidth < 850) {
        mainHeader.style.position = "static";
    }
});

window.addEventListener('resize', function() {
    if (window.innerWidth > 850 && window.pageYOffset > 84) {
        mainHeader.style.position = "fixed";
        mainHeader.style.top = "0";
    } else if (window.pageYOffset < 84 && window.innerWidth > 850) {
        mainHeader.style.position = "absolute";
        mainHeader.style.top = "6rem";
    } else if (window.innerWidth < 850) {
        mainHeader.style.position = "static";
    }
});
