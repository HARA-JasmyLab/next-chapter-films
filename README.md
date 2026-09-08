# Next Chapter FILMS

企業アニメーション制作LP。30秒動画：20万円（税別）。

## Files

- `dist/index.html`: LP本体。画像7点はHTML内に埋め込み済み。
- `vercel.json`: Vercel用の静的サイト設定。依存パッケージ・ビルド処理は不要。

## Vercel

Vercelの既存 `next-chapter-films` プロジェクトと `HARA-JasmyLab/next-chapter-films` のGit連携を確認済みです。

- Production Branch: `main`
- Framework Preset: Other
- Root Directory: リポジトリのルート
- Output Directory: `dist`
- Build / Install Command: 不要（vercel.jsonで無効化）

更新はmainへコミットし、VercelのDeploymentsで該当コミットの公開結果を確認してください。

## Domain

Settings → Domains に `studio.cpa-hara.com` を追加し、指定されたCNAME値をエックスサーバーのDNSレコード設定に登録してください。

## Contact

相談ボタンは既存の https://cpa-hara.com/contact/ に接続しています。LP内から直接送信するフォームや動画本編の埋め込みはありません。
