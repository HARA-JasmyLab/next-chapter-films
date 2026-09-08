# Next Chapter FILMS

企業アニメーション制作LP。30秒動画：20万円（税別）。

## Files

- `dist/index.html`: LP本体。画像7点はHTML内に埋め込み済み。
- `vercel.json`: Vercel用の静的サイト設定。依存パッケージ・ビルド処理は不要。

## Vercel

既存の `next-chapter-films` プロジェクトの Settings → Git から `HARA-JasmyLab/next-chapter-films` を接続してください。

- Production Branch: `main`
- Framework Preset: Other
- Root Directory: リポジトリのルート
- Output Directory: `dist`
- Build / Install Command: 不要（vercel.jsonで無効化）

接続後、mainのコミットを本番デプロイしてください。以後はmainへのpushで更新されます。

## Domain

Settings → Domains に `studio.cpa-hara.com` を追加し、指定されたCNAME値をエックスサーバーのDNSレコード設定に登録してください。

## Contact

相談ボタンは既存の https://cpa-hara.com/contact/ に接続しています。LP内から直接送信するフォームや動画本編の埋め込みはありません。
