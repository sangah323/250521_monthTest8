# ISSUE

1. React index, App 파일을 tsx로 변경 시 App 파일을 읽어오지 못함

   => tsconfig.json 작성 안 해서 생긴 문제, 제대로 작성하니 잘 불러와짐

   ^ 설정파일 꼭 챙기기 정신 똑바로 차리길-!

2. truffle로 migration 실패 ❗️미해결❗️

   - kaia로 연결되게 잘 확인?
     : 한다고 했는데 자꾸 ganache로 연결됨 (truffle은 기본적으로 ganache로 연결)
     : 결국 Remix로 배포

3. NFT 발급은 되는데 내용이 안보임

   - pinata에 data 제대로 올라감?
     : 혹시 몰라서 pinata 다시 올림

   => 스펠링 틀림
   "isfp://baf../" -> "ipfs://baf.../"

   ^ MBTI야? 정신머리-!

4. type error로 비교, toLowerCase() 등 안됨

   - type 확인 했?
     : void type이어서 생긴 error

   => 각각 type 제대로 명시해줌

5. 발급한 NFT 정보를 배열에 push 했음에도 반영되지 않음

   - console.log() 확인 했?
     : console.log(found) => length: 0으로 뜸
     : 제대로 push되지 않음

   => 상태가 변경됐음에도 불구하고 useState 호출 안 함
   => setMyNfts(found) 호출로 상태 업데이트

   ^ React는 `setState`로 상태 업데이트를 해야지만 렌더링ㄹ에 반영됨
   ^ React 다시 봐라

6. 메타마스크 주소를 변경하면 변경한 주소로 지갑 연결이 안됨

   - 왜,,?
     : 계정 활성화 안해놈 ^^

7. 화면 UI에서 MY NFT와 ALL NFT에 보여지는 NFT가 유동적임,,? 얘네가 왔다리갔다리ㅜ
   - 너 진짜 뭐냐
     => myNFT, allNFT의 for문 안에서 useState를 계속 호출하고 있었음
