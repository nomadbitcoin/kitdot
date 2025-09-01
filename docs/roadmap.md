ROADMAP:

The broader vision is to have an sdk of sdks...
documentation go beyond its own and inherits the included tooling/sdk docs...

- This is project overall and not limited to sdk codebase only.

- [ ] npx install initialize the sdk already "npx install kitdot"

AI Agents and Assistants:
The one who knows all the links...
[TO_IMPLEMENT_FURTHER] Could be connected with SEO data too
Create an workflow to ask different published GPT Agents about polkadot-substrate/etheruem. etc. to ask their link knowledge tree.

[LandingPage]:
use Reactbits.dev:

- https://reactbits.dev/components/card-swap
- https://reactbits.dev/components/spotlight-card
- https://reactbits.dev/animations/electric-border
- https://reactbits.dev/backgrounds/faulty-terminal or https://reactbits.dev/backgrounds/dot-grid

[Thirdweb CONTRACTS CODEBASE]
we must streess which contracts from thirweb can be deployed on polkavm. For this we need to get the current foundry repository https://github.com/thirdweb-dev/contracts/tree/main/contracts and test it using hardhat because polkavm still doesn't work with foundry, we need to figure out if best way of doing this research is with local networks or live testnet. Preferably local fork.

we must deploy and feedbacks.kitdot.dev route with feedback pages with simple html forms that submit to our n8n workflows who manages the data.
Ideally we must have a way to add multiple feedbacks to be used from different agents in different processes.
Ongoing open form...
Hackathon forms....
Buildathon forms....
and more can be brainstormed.

TEST:
We should have more tests. One that simulates all user actions within cli possibilities of templates on a empty environment.

Desired Features and UX:
Embedded cli/sdks
pop cli v0.9.0 above to run local nodes with polkavm for testing.
leverage scaffold-eth, examples, components https://scaffoldeth.io/
These should be dynamic for, front-end templates only if projects are full-stack or front-end only while pop cli if fulls tack or smart contracts only.
Can we use just launching chains and keep all ink related contracts off? should we? do we gain performance or just limit the developers?
Option to select contracts from pre-build and tested contracts [after thirdweb-contracts were tested on polkavm]
cli params, user can type init -i and the dependencies will be initialized within each project folder.

- Get Started with Your Polkadot DApp should not have instructions do user do npm install if he previously allowed the cli to run the dependency install...

UX:
Use ink https://github.com/vadimdemedes/ink to have-link experience and components on terminal. Search other deps on claude code.

Documentation
Should embedded documentation of cli/sdks being used on the project.
Our wiki should have documentation for each template explaining their big dependencies why being used and how to extend.
have llmstxt for our public resources.
We should research and decide if we will Use https://www.algolia.com/ for AI integration on the docs.
Is there a way we can build a "Map of Maps?" to somehow embedd from all other ecosystem maps of tools and Dapps.

AI Integrations:
how can we make the sdk usable by lovable or other AI generators? THe user should be able to say "use the template XXX from kitdot" or similar commands.

- Create GPT Agent with main useful links to help builders.

Project Management Templates?:
Could we also generate gh projects based on templates? generate wiki?

Branding:
Ethereum Elements with Polkadot Color Palet.

[TEMPLATES CODEBASE] Templates
Add template with wallet-only:

- [ ] https://github.com/reown-com/appkit-web-examples

React quick-starts/react-quick-start:

- [ ] Add button to export PK
- [ ] Fix: First time loading the app on stating (real deploy with saphire devnet) is showing empty items.
- [ ] Apply our brand to the template.
- [ ] Make it "single-file" or somehow easy for the developer to change it after initialize.
- [ ] Adicionar um exemplo funcional de contrato Oracle, que demonstre a inicialização e a interação com o contrato diretamente no template.

[Research]

- [ ] R&D: Test how to initialize contracts inside contracts.
- [ ] R&D: Pay transactions with any asset -> Leads to templates of it.
- [ ] R&D: Account Abstraction on PolkaVM -> Leads to templates of it.
