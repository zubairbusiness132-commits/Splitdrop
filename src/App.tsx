import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { Breadcrumb } from './components/Breadcrumb';
import { BackButton } from './components/BackButton';
import { SEOHead } from './components/SEOHead';
import { AdSlot } from './components/AdSlot';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { ToolRecommendations } from './components/ToolRecommendations';
import { InstallBanner } from './components/InstallBanner';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { toggleFavorite } from './lib/userStore';

// Platform Pages
const DashboardPage = lazy(() => import('./components/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const CategoryPage = lazy(() => import('./components/pages/CategoryPage').then(m => ({ default: m.CategoryPage })));
const HelpPage = lazy(() => import('./components/pages/HelpPage').then(m => ({ default: m.HelpPage })));
const ChangelogPage = lazy(() => import('./components/pages/ChangelogPage').then(m => ({ default: m.ChangelogPage })));
const FeedbackPage = lazy(() => import('./components/pages/FeedbackPage').then(m => ({ default: m.FeedbackPage })));

// Lazy loaded tool components
const SplitDropHero = lazy(() => import('./components/tools/SplitDropHero').then(m => ({ default: m.SplitDropHero })));
const ImageCompressorTool = lazy(() => import('./components/tools/ImageCompressorTool').then(m => ({ default: m.ImageCompressorTool })));
const ImageConverterTool = lazy(() => import('./components/tools/ImageConverterTool').then(m => ({ default: m.ImageConverterTool })));
const ImageResizerTool = lazy(() => import('./components/tools/image/ImageResizerTool').then(m => ({ default: m.ImageResizerTool })));
const CropImageTool = lazy(() => import('./components/tools/image/CropImageTool').then(m => ({ default: m.CropImageTool })));
const RotateImageTool = lazy(() => import('./components/tools/image/RotateImageTool').then(m => ({ default: m.RotateImageTool })));
const FlipImageTool = lazy(() => import('./components/tools/image/FlipImageTool').then(m => ({ default: m.FlipImageTool })));
const WatermarkImageTool = lazy(() => import('./components/tools/image/WatermarkImageTool').then(m => ({ default: m.WatermarkImageTool })));
const BlurImageTool = lazy(() => import('./components/tools/image/BlurImageTool').then(m => ({ default: m.BlurImageTool })));
const PixelateImageTool = lazy(() => import('./components/tools/image/PixelateImageTool').then(m => ({ default: m.PixelateImageTool })));
const ExifRemoverTool = lazy(() => import('./components/tools/image/ExifRemoverTool').then(m => ({ default: m.ExifRemoverTool })));
const ColorPickerTool = lazy(() => import('./components/tools/image/ColorPickerTool').then(m => ({ default: m.ColorPickerTool })));
const ImageInfoViewerTool = lazy(() => import('./components/tools/image/ImageInfoViewerTool').then(m => ({ default: m.ImageInfoViewerTool })));

const BackgroundColorChangerTool = lazy(() => import('./components/tools/image/BackgroundColorChangerTool').then(m => ({ default: m.BackgroundColorChangerTool })));
const RoundedCornerGeneratorTool = lazy(() => import('./components/tools/image/RoundedCornerGeneratorTool').then(m => ({ default: m.RoundedCornerGeneratorTool })));
const ImageBorderGeneratorTool = lazy(() => import('./components/tools/image/ImageBorderGeneratorTool').then(m => ({ default: m.ImageBorderGeneratorTool })));
const ImageFrameGeneratorTool = lazy(() => import('./components/tools/image/ImageFrameGeneratorTool').then(m => ({ default: m.ImageFrameGeneratorTool })));
const ImageCollageMakerTool = lazy(() => import('./components/tools/image/ImageCollageMakerTool').then(m => ({ default: m.ImageCollageMakerTool })));
const FaviconGeneratorTool = lazy(() => import('./components/tools/image/FaviconGeneratorTool').then(m => ({ default: m.FaviconGeneratorTool })));
const SvgOptimizerTool = lazy(() => import('./components/tools/image/SvgOptimizerTool').then(m => ({ default: m.SvgOptimizerTool })));
const GifMakerTool = lazy(() => import('./components/tools/image/GifMakerTool').then(m => ({ default: m.GifMakerTool })));
const BatchImageConverterTool = lazy(() => import('./components/tools/image/BatchImageConverterTool').then(m => ({ default: m.BatchImageConverterTool })));
const ImageCompressionComparisonTool = lazy(() => import('./components/tools/image/ImageCompressionComparisonTool').then(m => ({ default: m.ImageCompressionComparisonTool })));

const PdfMergeTool = lazy(() => import('./components/tools/PdfMergeTool').then(m => ({ default: m.PdfMergeTool })));
const PdfSplitTool = lazy(() => import('./components/tools/PdfSplitTool').then(m => ({ default: m.PdfSplitTool })));
const QrGeneratorTool = lazy(() => import('./components/tools/QrGeneratorTool').then(m => ({ default: m.QrGeneratorTool })));
const ResumeBuilderTool = lazy(() => import('./components/tools/ResumeBuilderTool').then(m => ({ default: m.ResumeBuilderTool })));

// Career Tools
const AtsResumeCheckerTool = lazy(() => import('./components/tools/career/AtsResumeCheckerTool').then(m => ({ default: m.AtsResumeCheckerTool })));
const ResumeScoreAnalyzerTool = lazy(() => import('./components/tools/career/ResumeScoreAnalyzerTool').then(m => ({ default: m.ResumeScoreAnalyzerTool })));
const CoverLetterBuilderTool = lazy(() => import('./components/tools/career/CoverLetterBuilderTool').then(m => ({ default: m.CoverLetterBuilderTool })));
const CoverLetterTemplatesTool = lazy(() => import('./components/tools/career/CoverLetterTemplatesTool').then(m => ({ default: m.CoverLetterTemplatesTool })));
const CvBuilderTool = lazy(() => import('./components/tools/career/CvBuilderTool').then(m => ({ default: m.CvBuilderTool })));
const ResumeKeywordOptimizerTool = lazy(() => import('./components/tools/career/ResumeKeywordOptimizerTool').then(m => ({ default: m.ResumeKeywordOptimizerTool })));
const ResumeTemplateGalleryTool = lazy(() => import('./components/tools/career/ResumeTemplateGalleryTool').then(m => ({ default: m.ResumeTemplateGalleryTool })));
const ResumeVersionManagerTool = lazy(() => import('./components/tools/career/ResumeVersionManagerTool').then(m => ({ default: m.ResumeVersionManagerTool })));
const ResumeImportTool = lazy(() => import('./components/tools/career/ResumeImportTool').then(m => ({ default: m.ResumeImportTool })));
const ResumeExportTool = lazy(() => import('./components/tools/career/ResumeExportTool').then(m => ({ default: m.ResumeExportTool })));
const ResumeCompletenessTool = lazy(() => import('./components/tools/career/ResumeCompletenessTool').then(m => ({ default: m.ResumeCompletenessTool })));
const ResumeSectionManagerTool = lazy(() => import('./components/tools/career/ResumeSectionManagerTool').then(m => ({ default: m.ResumeSectionManagerTool })));
const ProfessionalSkillLibraryTool = lazy(() => import('./components/tools/career/ProfessionalSkillLibraryTool').then(m => ({ default: m.ProfessionalSkillLibraryTool })));
const SummaryGeneratorTool = lazy(() => import('./components/tools/career/SummaryGeneratorTool').then(m => ({ default: m.SummaryGeneratorTool })));
const ResumeColorThemesTool = lazy(() => import('./components/tools/career/ResumeColorThemesTool').then(m => ({ default: m.ResumeColorThemesTool })));
const ExperienceCalculatorTool = lazy(() => import('./components/tools/career/ExperienceCalculatorTool').then(m => ({ default: m.ExperienceCalculatorTool })));
const NoticePeriodCalculatorTool = lazy(() => import('./components/tools/career/NoticePeriodCalculatorTool').then(m => ({ default: m.NoticePeriodCalculatorTool })));
const SalaryHikeCalculatorTool = lazy(() => import('./components/tools/career/SalaryHikeCalculatorTool').then(m => ({ default: m.SalaryHikeCalculatorTool })));
const CtcCalculatorTool = lazy(() => import('./components/tools/career/CtcCalculatorTool').then(m => ({ default: m.CtcCalculatorTool })));
const WorkingDaysCalculatorTool = lazy(() => import('./components/tools/career/WorkingDaysCalculatorTool').then(m => ({ default: m.WorkingDaysCalculatorTool })));

// Creator & Social Media Tools
const YouTubeTitleGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeTitleGeneratorTool').then(m => ({ default: m.YouTubeTitleGeneratorTool })));
const YouTubeDescriptionGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeDescriptionGeneratorTool').then(m => ({ default: m.YouTubeDescriptionGeneratorTool })));
const YouTubeTagsGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeTagsGeneratorTool').then(m => ({ default: m.YouTubeTagsGeneratorTool })));
const YouTubeHashtagGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeHashtagGeneratorTool').then(m => ({ default: m.YouTubeHashtagGeneratorTool })));
const YouTubeThumbnailPreviewTool = lazy(() => import('./components/tools/creator/YouTubeThumbnailPreviewTool').then(m => ({ default: m.YouTubeThumbnailPreviewTool })));
const YouTubeChannelNameGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeChannelNameGeneratorTool').then(m => ({ default: m.YouTubeChannelNameGeneratorTool })));
const YouTubeVideoIdeaGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeVideoIdeaGeneratorTool').then(m => ({ default: m.YouTubeVideoIdeaGeneratorTool })));
const YouTubePlaylistNameGeneratorTool = lazy(() => import('./components/tools/creator/YouTubePlaylistNameGeneratorTool').then(m => ({ default: m.YouTubePlaylistNameGeneratorTool })));
const YouTubeTimestampGeneratorTool = lazy(() => import('./components/tools/creator/YouTubeTimestampGeneratorTool').then(m => ({ default: m.YouTubeTimestampGeneratorTool })));
const YouTubeDescriptionFormatterTool = lazy(() => import('./components/tools/creator/YouTubeDescriptionFormatterTool').then(m => ({ default: m.YouTubeDescriptionFormatterTool })));
const ThumbnailTextGeneratorTool = lazy(() => import('./components/tools/creator/ThumbnailTextGeneratorTool').then(m => ({ default: m.ThumbnailTextGeneratorTool })));
const ViralHookGeneratorTool = lazy(() => import('./components/tools/creator/ViralHookGeneratorTool').then(m => ({ default: m.ViralHookGeneratorTool })));
const CtaGeneratorTool = lazy(() => import('./components/tools/creator/CtaGeneratorTool').then(m => ({ default: m.CtaGeneratorTool })));
const SocialCharacterCounterTool = lazy(() => import('./components/tools/creator/SocialCharacterCounterTool').then(m => ({ default: m.SocialCharacterCounterTool })));
const EmojiGeneratorTool = lazy(() => import('./components/tools/creator/EmojiGeneratorTool').then(m => ({ default: m.EmojiGeneratorTool })));
const InstagramCaptionGeneratorTool = lazy(() => import('./components/tools/creator/InstagramCaptionGeneratorTool').then(m => ({ default: m.InstagramCaptionGeneratorTool })));
const InstagramHashtagGeneratorTool = lazy(() => import('./components/tools/creator/InstagramHashtagGeneratorTool').then(m => ({ default: m.InstagramHashtagGeneratorTool })));
const InstagramBioGeneratorTool = lazy(() => import('./components/tools/creator/InstagramBioGeneratorTool').then(m => ({ default: m.InstagramBioGeneratorTool })));
const InstagramUsernameGeneratorTool = lazy(() => import('./components/tools/creator/InstagramUsernameGeneratorTool').then(m => ({ default: m.InstagramUsernameGeneratorTool })));
const TikTokCaptionGeneratorTool = lazy(() => import('./components/tools/creator/TikTokCaptionGeneratorTool').then(m => ({ default: m.TikTokCaptionGeneratorTool })));
const TikTokHashtagGeneratorTool = lazy(() => import('./components/tools/creator/TikTokHashtagGeneratorTool').then(m => ({ default: m.TikTokHashtagGeneratorTool })));
const FacebookCaptionGeneratorTool = lazy(() => import('./components/tools/creator/FacebookCaptionGeneratorTool').then(m => ({ default: m.FacebookCaptionGeneratorTool })));
const FacebookHashtagGeneratorTool = lazy(() => import('./components/tools/creator/FacebookHashtagGeneratorTool').then(m => ({ default: m.FacebookHashtagGeneratorTool })));
const LinkedInHeadlineGeneratorTool = lazy(() => import('./components/tools/creator/LinkedInHeadlineGeneratorTool').then(m => ({ default: m.LinkedInHeadlineGeneratorTool })));
const LinkedInSummaryGeneratorTool = lazy(() => import('./components/tools/creator/LinkedInSummaryGeneratorTool').then(m => ({ default: m.LinkedInSummaryGeneratorTool })));
const TwitterBioGeneratorTool = lazy(() => import('./components/tools/creator/TwitterBioGeneratorTool').then(m => ({ default: m.TwitterBioGeneratorTool })));
const UniversalHashtagGeneratorTool = lazy(() => import('./components/tools/creator/UniversalHashtagGeneratorTool').then(m => ({ default: m.UniversalHashtagGeneratorTool })));
const FancyTextGeneratorTool = lazy(() => import('./components/tools/creator/FancyTextGeneratorTool').then(m => ({ default: m.FancyTextGeneratorTool })));
const UnicodeFontGeneratorTool = lazy(() => import('./components/tools/creator/UnicodeFontGeneratorTool').then(m => ({ default: m.UnicodeFontGeneratorTool })));
const TextDecoratorTool = lazy(() => import('./components/tools/creator/TextDecoratorTool').then(m => ({ default: m.TextDecoratorTool })));
const EmojiCombinerTool = lazy(() => import('./components/tools/creator/EmojiCombinerTool').then(m => ({ default: m.EmojiCombinerTool })));
const SocialMediaPostFormatterTool = lazy(() => import('./components/tools/creator/SocialMediaPostFormatterTool').then(m => ({ default: m.SocialMediaPostFormatterTool })));
const SocialBioLinkBuilderTool = lazy(() => import('./components/tools/creator/SocialBioLinkBuilderTool').then(m => ({ default: m.SocialBioLinkBuilderTool })));

// PDF Tools
const ImageToPdfTool = lazy(() => import('./components/tools/pdf/ImageToPdfTool').then(m => ({ default: m.ImageToPdfTool })));
const PdfToImagesTool = lazy(() => import('./components/tools/pdf/PdfToImagesTool').then(m => ({ default: m.PdfToImagesTool })));
const RotatePdfTool = lazy(() => import('./components/tools/pdf/RotatePdfTool').then(m => ({ default: m.RotatePdfTool })));
const DeletePdfPagesTool = lazy(() => import('./components/tools/pdf/DeletePdfPagesTool').then(m => ({ default: m.DeletePdfPagesTool })));
const ExtractPdfPagesTool = lazy(() => import('./components/tools/pdf/ExtractPdfPagesTool').then(m => ({ default: m.ExtractPdfPagesTool })));
const ReorderPdfPagesTool = lazy(() => import('./components/tools/pdf/ReorderPdfPagesTool').then(m => ({ default: m.ReorderPdfPagesTool })));
const PdfWatermarkTool = lazy(() => import('./components/tools/pdf/PdfWatermarkTool').then(m => ({ default: m.PdfWatermarkTool })));
const ProtectPdfTool = lazy(() => import('./components/tools/pdf/ProtectPdfTool').then(m => ({ default: m.ProtectPdfTool })));
const UnlockPdfTool = lazy(() => import('./components/tools/pdf/UnlockPdfTool').then(m => ({ default: m.UnlockPdfTool })));
const PdfMetadataTool = lazy(() => import('./components/tools/pdf/PdfMetadataTool').then(m => ({ default: m.PdfMetadataTool })));

// Developer Tools
const UuidGeneratorTool = lazy(() => import('./components/tools/dev/UuidGeneratorTool').then(m => ({ default: m.UuidGeneratorTool })));
const HashGeneratorTool = lazy(() => import('./components/tools/dev/HashGeneratorTool').then(m => ({ default: m.HashGeneratorTool })));
const JwtDecoderTool = lazy(() => import('./components/tools/dev/JwtDecoderTool').then(m => ({ default: m.JwtDecoderTool })));
const UnixTimestampConverterTool = lazy(() => import('./components/tools/dev/UnixTimestampConverterTool').then(m => ({ default: m.UnixTimestampConverterTool })));
const RegexTesterTool = lazy(() => import('./components/tools/dev/RegexTesterTool').then(m => ({ default: m.RegexTesterTool })));
const JsonFormatterTool = lazy(() => import('./components/tools/dev/JsonFormatterTool').then(m => ({ default: m.JsonFormatterTool })));
const JsonValidatorTool = lazy(() => import('./components/tools/dev/JsonValidatorTool').then(m => ({ default: m.JsonValidatorTool })));
const JsonToCsvTool = lazy(() => import('./components/tools/dev/JsonToCsvTool').then(m => ({ default: m.JsonToCsvTool })));
const CsvToJsonTool = lazy(() => import('./components/tools/dev/CsvToJsonTool').then(m => ({ default: m.CsvToJsonTool })));
const CsvViewerTool = lazy(() => import('./components/tools/dev/CsvViewerTool').then(m => ({ default: m.CsvViewerTool })));
const HtmlFormatterTool = lazy(() => import('./components/tools/dev/HtmlFormatterTool').then(m => ({ default: m.HtmlFormatterTool })));
const CssFormatterTool = lazy(() => import('./components/tools/dev/CssFormatterTool').then(m => ({ default: m.CssFormatterTool })));
const JsFormatterTool = lazy(() => import('./components/tools/dev/JsFormatterTool').then(m => ({ default: m.JsFormatterTool })));
const XmlFormatterTool = lazy(() => import('./components/tools/dev/XmlFormatterTool').then(m => ({ default: m.XmlFormatterTool })));
const XmlValidatorTool = lazy(() => import('./components/tools/dev/XmlValidatorTool').then(m => ({ default: m.XmlValidatorTool })));
const UrlParserTool = lazy(() => import('./components/tools/dev/UrlParserTool').then(m => ({ default: m.UrlParserTool })));
const UrlEncoderDecoderTool = lazy(() => import('./components/tools/dev/UrlEncoderDecoderTool').then(m => ({ default: m.UrlEncoderDecoderTool })));
const Base64EncoderDecoderTool = lazy(() => import('./components/tools/dev/Base64EncoderDecoderTool').then(m => ({ default: m.Base64EncoderDecoderTool })));
const HtmlEscapeUnescapeTool = lazy(() => import('./components/tools/dev/HtmlEscapeUnescapeTool').then(m => ({ default: m.HtmlEscapeUnescapeTool })));
const HttpHeaderViewerTool = lazy(() => import('./components/tools/dev/HttpHeaderViewerTool').then(m => ({ default: m.HttpHeaderViewerTool })));
const ApiRequestBuilderTool = lazy(() => import('./components/tools/dev/ApiRequestBuilderTool').then(m => ({ default: m.ApiRequestBuilderTool })));
const ColorConverterTool = lazy(() => import('./components/tools/dev/ColorConverterTool').then(m => ({ default: m.ColorConverterTool })));
const QrCodeDecoderTool = lazy(() => import('./components/tools/dev/QrCodeDecoderTool').then(m => ({ default: m.QrCodeDecoderTool })));

// Design & Utility Tools
const CssGradientGeneratorTool = lazy(() => import('./components/tools/design/CssGradientGeneratorTool').then(m => ({ default: m.CssGradientGeneratorTool })));
const BoxShadowGeneratorTool = lazy(() => import('./components/tools/design/BoxShadowGeneratorTool').then(m => ({ default: m.BoxShadowGeneratorTool })));
const BorderRadiusGeneratorTool = lazy(() => import('./components/tools/design/BorderRadiusGeneratorTool').then(m => ({ default: m.BorderRadiusGeneratorTool })));
const GlassmorphismGeneratorTool = lazy(() => import('./components/tools/design/GlassmorphismGeneratorTool').then(m => ({ default: m.GlassmorphismGeneratorTool })));
const NeumorphismGeneratorTool = lazy(() => import('./components/tools/design/NeumorphismGeneratorTool').then(m => ({ default: m.NeumorphismGeneratorTool })));
const CssClipPathGeneratorTool = lazy(() => import('./components/tools/design/CssClipPathGeneratorTool').then(m => ({ default: m.CssClipPathGeneratorTool })));
const SvgShapeGeneratorTool = lazy(() => import('./components/tools/design/SvgShapeGeneratorTool').then(m => ({ default: m.SvgShapeGeneratorTool })));
const ColorPaletteGeneratorTool = lazy(() => import('./components/tools/design/ColorPaletteGeneratorTool').then(m => ({ default: m.ColorPaletteGeneratorTool })));
const ContrastCheckerTool = lazy(() => import('./components/tools/design/ContrastCheckerTool').then(m => ({ default: m.ContrastCheckerTool })));
const RandomColorGeneratorTool = lazy(() => import('./components/tools/design/RandomColorGeneratorTool').then(m => ({ default: m.RandomColorGeneratorTool })));
const QrBusinessCardGeneratorTool = lazy(() => import('./components/tools/design/QrBusinessCardGeneratorTool').then(m => ({ default: m.QrBusinessCardGeneratorTool })));
const UnitConverterTool = lazy(() => import('./components/tools/design/UnitConverterTool').then(m => ({ default: m.UnitConverterTool })));
const PercentageCalculatorTool = lazy(() => import('./components/tools/design/PercentageCalculatorTool').then(m => ({ default: m.PercentageCalculatorTool })));
const AgeCalculatorTool = lazy(() => import('./components/tools/design/AgeCalculatorTool').then(m => ({ default: m.AgeCalculatorTool })));
const EmiCalculatorTool = lazy(() => import('./components/tools/design/EmiCalculatorTool').then(m => ({ default: m.EmiCalculatorTool })));
const DiscountCalculatorTool = lazy(() => import('./components/tools/design/DiscountCalculatorTool').then(m => ({ default: m.DiscountCalculatorTool })));
const CurrencyCalculatorTool = lazy(() => import('./components/tools/design/CurrencyCalculatorTool').then(m => ({ default: m.CurrencyCalculatorTool })));
const TipCalculatorTool = lazy(() => import('./components/tools/design/TipCalculatorTool').then(m => ({ default: m.TipCalculatorTool })));
const RandomNumberGeneratorTool = lazy(() => import('./components/tools/design/RandomNumberGeneratorTool').then(m => ({ default: m.RandomNumberGeneratorTool })));
const RandomPasswordGeneratorTool = lazy(() => import('./components/tools/design/RandomPasswordGeneratorTool').then(m => ({ default: m.RandomPasswordGeneratorTool })));

// AI Prompt Builder Tools
const ChatgptPromptBuilderTool = lazy(() => import('./components/tools/prompt/ChatgptPromptBuilderTool').then(m => ({ default: m.ChatgptPromptBuilderTool })));
const GeminiPromptBuilderTool = lazy(() => import('./components/tools/prompt/GeminiPromptBuilderTool').then(m => ({ default: m.GeminiPromptBuilderTool })));
const ClaudePromptBuilderTool = lazy(() => import('./components/tools/prompt/ClaudePromptBuilderTool').then(m => ({ default: m.ClaudePromptBuilderTool })));
const VeoPromptBuilderTool = lazy(() => import('./components/tools/prompt/VeoPromptBuilderTool').then(m => ({ default: m.VeoPromptBuilderTool })));
const MidjourneyPromptBuilderTool = lazy(() => import('./components/tools/prompt/MidjourneyPromptBuilderTool').then(m => ({ default: m.MidjourneyPromptBuilderTool })));
const FluxPromptBuilderTool = lazy(() => import('./components/tools/prompt/FluxPromptBuilderTool').then(m => ({ default: m.FluxPromptBuilderTool })));
const StableDiffusionPromptBuilderTool = lazy(() => import('./components/tools/prompt/StableDiffusionPromptBuilderTool').then(m => ({ default: m.StableDiffusionPromptBuilderTool })));
const LogoPromptBuilderTool = lazy(() => import('./components/tools/prompt/LogoPromptBuilderTool').then(m => ({ default: m.LogoPromptBuilderTool })));
const ThumbnailPromptBuilderTool = lazy(() => import('./components/tools/prompt/ThumbnailPromptBuilderTool').then(m => ({ default: m.ThumbnailPromptBuilderTool })));
const ProductPhotoPromptBuilderTool = lazy(() => import('./components/tools/prompt/ProductPhotoPromptBuilderTool').then(m => ({ default: m.ProductPhotoPromptBuilderTool })));
const InteriorDesignPromptBuilderTool = lazy(() => import('./components/tools/prompt/InteriorDesignPromptBuilderTool').then(m => ({ default: m.InteriorDesignPromptBuilderTool })));
const StoryPromptBuilderTool = lazy(() => import('./components/tools/prompt/StoryPromptBuilderTool').then(m => ({ default: m.StoryPromptBuilderTool })));
const YoutubeScriptPromptBuilderTool = lazy(() => import('./components/tools/prompt/YoutubeScriptPromptBuilderTool').then(m => ({ default: m.YoutubeScriptPromptBuilderTool })));
const ResumePromptBuilderTool = lazy(() => import('./components/tools/prompt/ResumePromptBuilderTool').then(m => ({ default: m.ResumePromptBuilderTool })));
const CoverLetterPromptBuilderTool = lazy(() => import('./components/tools/prompt/CoverLetterPromptBuilderTool').then(m => ({ default: m.CoverLetterPromptBuilderTool })));
const EmailPromptBuilderTool = lazy(() => import('./components/tools/prompt/EmailPromptBuilderTool').then(m => ({ default: m.EmailPromptBuilderTool })));
const SocialMediaPromptBuilderTool = lazy(() => import('./components/tools/prompt/SocialMediaPromptBuilderTool').then(m => ({ default: m.SocialMediaPromptBuilderTool })));
const SeoPromptBuilderTool = lazy(() => import('./components/tools/prompt/SeoPromptBuilderTool').then(m => ({ default: m.SeoPromptBuilderTool })));
const CodingPromptBuilderTool = lazy(() => import('./components/tools/prompt/CodingPromptBuilderTool').then(m => ({ default: m.CodingPromptBuilderTool })));
const UniversalPromptBuilderTool = lazy(() => import('./components/tools/prompt/UniversalPromptBuilderTool').then(m => ({ default: m.UniversalPromptBuilderTool })));

// Lazy loaded legal & informational pages
const PrivacyPolicyPage = lazy(() => import('./components/pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('./components/pages/TermsPage').then(m => ({ default: m.TermsPage })));
const DisclaimerPage = lazy(() => import('./components/pages/DisclaimerPage').then(m => ({ default: m.DisclaimerPage })));
const ContactPage = lazy(() => import('./components/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const AboutPage = lazy(() => import('./components/pages/AboutPage').then(m => ({ default: m.AboutPage })));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center min-h-[300px]">
    <div className="w-10 h-10 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading module...</p>
  </div>
);

import { TOOLS_DATA, HOMEPAGE_FAQS, getTranslatedTools, getTranslatedFaqs } from './data/toolsData';
import { detectBrowserLanguage, LanguageCode, getTranslation } from './lib/i18n';
import { LanguageProvider } from './context/LanguageContext';
import { normalizePath, getLinkUrl } from './lib/paths';
import { ArrowRight, ChevronDown, CheckCircle2, Shield, Zap, Sparkles } from 'lucide-react';

export default function App() {
  // Path routing state
  const [currentPath, setCurrentPath] = useState<string>(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const redirectParam = searchParams.get('p');
      if (redirectParam) {
        const cleanPath = '/' + redirectParam.replace(/^\//, '');
        const fullUrl = getLinkUrl(cleanPath);
        window.history.replaceState({}, '', fullUrl);
        return normalizePath(cleanPath);
      }
    } catch {
      // Ignore URL parsing fallback
    }

    return normalizePath(window.location.pathname);
  });

  // Language state
  const [currentLang, setCurrentLang] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-lang');
      if (saved) return saved as LanguageCode;
    } catch {
      // ignore
    }
    return detectBrowserLanguage();
  });

  // Dark Mode state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('splitdrop-theme');
      if (saved) return saved === 'dark';
    } catch {
      // ignore
    }
    try {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Search modal state
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // FAQ open states
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const translatedTools = getTranslatedTools(currentLang);
  const translatedFaqs = getTranslatedFaqs(currentLang);

  // Find tool metadata for current page
  const activeTool = translatedTools.find((t) => {
    if (t.path === currentPath) return true;
    if (t.filename !== 'index.html' && currentPath.endsWith(t.filename)) return true;
    if (t.filename !== 'index.html' && currentPath.endsWith(t.id)) return true;
    if (t.filename !== 'index.html' && currentPath.endsWith(`/${t.id}`)) return true;
    return false;
  });

  // Global Keyboard Shortcuts (Ctrl+K, Ctrl+D, Ctrl+/, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (isCmdOrCtrl && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (activeTool) {
          const added = toggleFavorite(activeTool.id);
          triggerToast(added ? 'Added tool to favorites! ⭐' : 'Removed from favorites');
        } else {
          triggerToast('Open a tool to bookmark it to favorites!');
        }
      } else if (isCmdOrCtrl && e.key === '/') {
        e.preventDefault();
        setShortcutsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTool]);

  // Apply dark mode class
  useEffect(() => {
    try {
      if (darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('splitdrop-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('splitdrop-theme', 'light');
      }
    } catch {
      // Storage restricted
    }
  }, [darkMode]);

  // Apply RTL direction for Arabic & Urdu
  useEffect(() => {
    try {
      localStorage.setItem('splitdrop-lang', currentLang);
      if (currentLang === 'ar' || currentLang === 'ur') {
        document.documentElement.dir = 'rtl';
      } else {
        document.documentElement.dir = 'ltr';
      }
    } catch {
      // ignore
    }
  }, [currentLang]);

  // Handle popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    const norm = normalizePath(path);
    const fullUrl = getLinkUrl(norm);
    window.history.pushState({}, '', fullUrl);
    setCurrentPath(norm);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Static Legal/Info Page checks
  const isPrivacyPage = currentPath.includes('privacy');
  const isTermsPage = currentPath.includes('terms');
  const isDisclaimerPage = currentPath.includes('disclaimer');
  const isContactPage = currentPath.includes('contact');
  const isAboutPage = currentPath.includes('about');

  // Platform Feature Page checks
  const isDashboardPage = currentPath.includes('dashboard');
  const isCategoryPage = currentPath.includes('category') || currentPath.includes('categories');
  const isHelpPage = currentPath.includes('help');
  const isChangelogPage = currentPath.includes('changelog');
  const isFeedbackPage = currentPath.includes('feedback');

  const isPlatformPage = isDashboardPage || isCategoryPage || isHelpPage || isChangelogPage || isFeedbackPage;
  const isStaticPage = isPrivacyPage || isTermsPage || isDisclaimerPage || isContactPage || isAboutPage || isPlatformPage;

  return (
    <LanguageProvider currentLang={currentLang} onChangeLang={setCurrentLang}>
      <div className="relative min-h-screen flex flex-col font-sans bg-slate-100/90 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors selection:bg-indigo-600 selection:text-white overflow-x-hidden">
        
        {/* Subtle Ambient Background Glass Glowing Orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-500/15 dark:bg-indigo-600/15 blur-3xl animate-glass-orb-1" />
          <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-purple-500/15 dark:bg-purple-600/15 blur-3xl animate-glass-orb-2" />
          <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-blue-500/10 dark:bg-blue-600/10 blur-3xl animate-glass-orb-1" />
        </div>

        {/* Glass Toast Banner */}
        {toastMsg && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-white/60 dark:border-white/10 text-slate-900 dark:text-white font-bold text-xs sm:text-sm shadow-2xl shadow-indigo-500/10 flex items-center gap-2 animate-bounce">
            <span className="text-emerald-500 font-black">✓</span> {toastMsg}
          </div>
        )}

        {/* Sticky Header Container with Top Announcement Bar */}
        <div className="sticky top-0 z-50 w-full">
          <AnnouncementBanner position="top" onNavigate={navigateTo} />
          <Header
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onOpenSearch={() => setSearchOpen(true)}
            currentPath={currentPath}
            onNavigate={navigateTo}
            currentLang={currentLang}
            onChangeLang={setCurrentLang}
          />
        </div>

        {/* Main Page Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-8">
          
          {/* ========================================================
              STATIC INFORMATIONAL / LEGAL PAGES
              ======================================================== */}
          {isStaticPage && (
            <div className="max-w-5xl mx-auto space-y-6">
              
              {/* Sticky Navigation Bar with Back Button & Breadcrumbs */}
              <div className="sticky top-28 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl py-3 px-4 sm:px-6 -mx-4 sm:-mx-6 border-b border-white/50 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3 rounded-2xl mb-4">
                <BackButton onNavigate={navigateTo} />
                <Breadcrumb
                  items={[
                    { label: 'Home', path: getLinkUrl('/') },
                    { label: isDashboardPage ? 'User Dashboard' : isCategoryPage ? 'Tool Categories' : isHelpPage ? 'Help Center' : isChangelogPage ? 'Changelog' : isFeedbackPage ? 'Feedback' : isPrivacyPage ? getTranslation(currentLang, 'privacy', 'Privacy Policy') : isTermsPage ? getTranslation(currentLang, 'terms', 'Terms') : isDisclaimerPage ? getTranslation(currentLang, 'disclaimer', 'Disclaimer') : isContactPage ? getTranslation(currentLang, 'contact', 'Contact') : getTranslation(currentLang, 'about', 'About') }
                  ]}
                  onNavigate={navigateTo}
                />
              </div>

              <Suspense fallback={<LoadingFallback />}>
                {isDashboardPage && <DashboardPage onNavigate={navigateTo} onShowToast={triggerToast} />}
                {isCategoryPage && <CategoryPage onNavigate={navigateTo} onShowToast={triggerToast} />}
                {isHelpPage && <HelpPage onNavigate={navigateTo} />}
                {isChangelogPage && <ChangelogPage />}
                {isFeedbackPage && <FeedbackPage onShowToast={triggerToast} />}
                {isPrivacyPage && <PrivacyPolicyPage onNavigate={navigateTo} />}
                {isTermsPage && <TermsPage onNavigate={navigateTo} />}
                {isDisclaimerPage && <DisclaimerPage onNavigate={navigateTo} />}
                {isContactPage && <ContactPage onShowToast={triggerToast} />}
                {isAboutPage && <AboutPage onNavigate={navigateTo} />}
              </Suspense>
            </div>
          )}

          {/* ========================================================
              HOMEPAGE VIEW
              ======================================================== */}
          {!isStaticPage && (!activeTool || activeTool.id === 'splitdrop') && (
            <>
              <SEOHead
                title="SplitDrop — Split & Merge Images Online Free"
                description="Free online image splitter and merger. Split images cleanly along any line or combine two photos seamlessly with instant browser processing & zero uploads."
                canonicalPath="/"
                faqs={HOMEPAGE_FAQS}
              />

              {/* Hero Welcome Banner */}
              <div className="text-center max-w-2xl mx-auto my-4 sm:my-6 relative">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-indigo-950/60 backdrop-blur-md text-indigo-600 dark:text-indigo-300 font-bold text-xs mb-3 border border-indigo-200/80 dark:border-indigo-800/80 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" /> SplitDrop Original Tool
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                  {getTranslation(currentLang, 'splitAndCombine', 'Split & Combine Images Seamlessly')}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-3 leading-relaxed font-normal">
                  {getTranslation(currentLang, 'heroSubtitle', 'Cut an image clean down any line or join two images into a composite. Drag the line on canvas in real-time with zero server uploads.')}
                </p>
              </div>

              {/* HERO TOOL */}
              <div className="glass-panel rounded-3xl overflow-hidden max-w-3xl mx-auto">
                <Suspense fallback={<LoadingFallback />}>
                  <SplitDropHero onShowToast={triggerToast} />
                </Suspense>
              </div>

              {/* AD PLACEMENT 1 */}
              <AdSlot type="banner" label="Advertisement" />

              {/* MORE FREE TOOLS SECTION */}
              <section className="my-12">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200/80 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                      {getTranslation(currentLang, 'freeTools', 'Free Multi-Tool Suite')}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {getTranslation(currentLang, 'moreFreeTools', 'More Free Online Tools')}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 sm:mt-0 font-medium">
                    {getTranslation(currentLang, 'fastBrowserBased', 'Fast, browser-based, zero installation required')}
                  </p>
                </div>

                {/* Grouped Category Grids */}
                <div className="space-y-12">
                  {Array.from(new Set(translatedTools.filter(t => t.id !== 'splitdrop').map(t => t.category))).map((catName) => {
                    const categoryTools = translatedTools.filter(t => t.id !== 'splitdrop' && t.category === catName);
                    if (!categoryTools.length) return null;
                    return (
                      <div key={catName} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                            {catName}
                          </h3>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold">
                            {categoryTools.length} Tools
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {categoryTools.map((tool) => (
                            <div
                              key={tool.id}
                              className="glass-card flex flex-col justify-between p-6 rounded-3xl group cursor-pointer hover:border-indigo-500/30 transition-all"
                              onClick={() => navigateTo(getLinkUrl(tool.path))}
                            >
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <span className="text-3xl p-3 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 inline-block group-hover:scale-110 transition-transform">
                                    {tool.icon}
                                  </span>
                                  {tool.badge && (
                                    <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-indigo-600/10 dark:bg-indigo-400/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-800/50">
                                      {tool.badge}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                  {tool.title}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                  {tool.description}
                                </p>

                                <ul className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-slate-800/60 pt-3">
                                  {tool.features.slice(0, 3).map((f, i) => (
                                    <li key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                      <span>{f}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigateTo(getLinkUrl(tool.path));
                                  }}
                                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-indigo-500/20"
                                >
                                  <span>{getTranslation(currentLang, 'openTool', 'Open')} {tool.navTitle}</span>
                                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* AD PLACEMENT 2 */}
              <AdSlot type="native" label="Sponsored Content" />

              {/* FEATURES SECTION */}
              <section className="glass-panel my-12 p-8 sm:p-12 rounded-3xl text-slate-900 dark:text-white">
                <div className="max-w-3xl">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    {getTranslation(currentLang, 'builtForSpeedAndPrivacy', 'Built for Speed & Privacy')}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black mt-2 leading-tight">
                    {getTranslation(currentLang, 'whyCreatorsChoose', 'Why Creators & Professionals Choose SplitDrop')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                    Traditional web tools upload your private pictures and PDFs to distant cloud servers. SplitDrop runs 100% inside your local browser using modern HTML5 Canvas, PDF-lib, and Web Assembly.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
                  <div className="glass-card p-5 rounded-2xl">
                    <Shield className="w-7 h-7 text-indigo-600 dark:text-indigo-400 mb-3" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{getTranslation(currentLang, 'zeroServerUploads', 'Zero Server Uploads')}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {getTranslation(currentLang, 'zeroServerUploadsDesc', 'Your confidential files never leave your device memory. Total security.')}
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-2xl">
                    <Zap className="w-7 h-7 text-amber-500 mb-3" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{getTranslation(currentLang, 'instantSpeed', 'Sub-Second Processing')}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {getTranslation(currentLang, 'instantSpeedDesc', 'No upload wait times or server queue bottlenecks. Instant results.')}
                    </p>
                  </div>

                  <div className="glass-card p-5 rounded-2xl">
                    <Sparkles className="w-7 h-7 text-emerald-500 mb-3" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{getTranslation(currentLang, 'freeForever', 'Free Forever')}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {getTranslation(currentLang, 'freeForeverDesc', 'No watermarks, daily submission limits, or required accounts.')}
                    </p>
                  </div>
                </div>
              </section>

              {/* HOMEPAGE FAQ SECTION */}
              <section className="my-12 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                    {getTranslation(currentLang, 'faqsTitle', 'Frequently Asked Questions')}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {getTranslation(currentLang, 'faqSubtitle', 'Everything you need to know about SplitDrop and our free online tools.')}
                  </p>
                </div>

                <div className="space-y-3">
                  {translatedFaqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div
                        key={idx}
                        className="glass-card rounded-2xl overflow-hidden transition-all"
                      >
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-indigo-600' : ''}`} />
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* AD PLACEMENT 3 */}
              <AdSlot type="banner" label="Advertisement" />
            </>
          )}

          {/* ========================================================
              DEDICATED TOOL PAGES
              ======================================================== */}
          {!isStaticPage && activeTool && activeTool.id !== 'splitdrop' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <SEOHead
                title={`${activeTool.title} — SplitDrop`}
                description={activeTool.description}
                canonicalPath={activeTool.path}
                toolMeta={activeTool}
                breadcrumbs={[
                  { label: 'Home', path: getLinkUrl('/') },
                  { label: activeTool.navTitle }
                ]}
              />

              {/* Sticky Navigation Bar with Professional Back Button & Breadcrumbs */}
              <div className="sticky top-16 z-40 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl py-3 px-4 sm:px-6 -mx-4 sm:-mx-6 border-b border-white/50 dark:border-white/10 shadow-sm flex flex-wrap items-center justify-between gap-3 rounded-2xl mb-2">
                <BackButton onNavigate={navigateTo} />
                <Breadcrumb
                  items={[
                    { label: 'Home', path: getLinkUrl('/') },
                    { label: activeTool.navTitle }
                  ]}
                  onNavigate={navigateTo}
                />
              </div>

              {/* Tool Title Banner */}
              <div className="text-center max-w-2xl mx-auto mb-4">
                <span className="text-4xl mb-2 inline-block">{activeTool.icon}</span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {activeTool.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {activeTool.description}
                </p>
              </div>

              {/* TOOL PAGE AD 1 */}
              <AdSlot type="banner" label="Advertisement" />

              {/* THE TOOL COMPONENT INTERFACE WRAPPED IN FROSTED GLASS */}
              <div className="glass-panel rounded-3xl overflow-hidden">
                <Suspense fallback={<LoadingFallback />}>
                  {activeTool.id === 'image-compressor' && <ImageCompressorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'image-converter' && <ImageConverterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'image-resizer' && <ImageResizerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'crop-image' && <CropImageTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'rotate-image' && <RotateImageTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'flip-image' && <FlipImageTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'image-watermark' && <WatermarkImageTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'blur-image' && <BlurImageTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'pixelate-image' && <PixelateImageTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'exif-remover' && <ExifRemoverTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'image-color-picker' && <ColorPickerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'image-info-viewer' && <ImageInfoViewerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'background-color-changer' && <BackgroundColorChangerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'rounded-corners' && <RoundedCornerGeneratorTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'image-border' && <ImageBorderGeneratorTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'image-frame' && <ImageFrameGeneratorTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'image-collage' && <ImageCollageMakerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'favicon-generator' && <FaviconGeneratorTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'svg-optimizer' && <SvgOptimizerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'gif-maker' && <GifMakerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'batch-image-converter' && <BatchImageConverterTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'compression-comparison' && <ImageCompressionComparisonTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'pdf-merge' && <PdfMergeTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-split' && <PdfSplitTool onShowToast={triggerToast} />}
                  {activeTool.id === 'image-to-pdf' && <ImageToPdfTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-to-images' && <PdfToImagesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'rotate-pdf' && <RotatePdfTool onShowToast={triggerToast} />}
                  {activeTool.id === 'delete-pdf-pages' && <DeletePdfPagesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'extract-pdf-pages' && <ExtractPdfPagesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'reorder-pdf-pages' && <ReorderPdfPagesTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-watermark' && <PdfWatermarkTool onShowToast={triggerToast} />}
                  {activeTool.id === 'protect-pdf' && <ProtectPdfTool onShowToast={triggerToast} />}
                  {activeTool.id === 'unlock-pdf' && <UnlockPdfTool onShowToast={triggerToast} />}
                  {activeTool.id === 'pdf-metadata' && <PdfMetadataTool onShowToast={triggerToast} />}
                  {activeTool.id === 'qr-generator' && <QrGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'resume-builder' && <ResumeBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'ats-resume-checker' && <AtsResumeCheckerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'resume-score-analyzer' && <ResumeScoreAnalyzerTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'cover-letter-builder' && <CoverLetterBuilderTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'cover-letter-templates' && <CoverLetterTemplatesTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'cv-builder' && <CvBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'resume-keyword-optimizer' && <ResumeKeywordOptimizerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'resume-template-gallery' && <ResumeTemplateGalleryTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'resume-version-manager' && <ResumeVersionManagerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'resume-import' && <ResumeImportTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'resume-export' && <ResumeExportTool onShowToast={triggerToast} />}
                  {activeTool.id === 'resume-completeness' && <ResumeCompletenessTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'resume-section-manager' && <ResumeSectionManagerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'professional-skill-library' && <ProfessionalSkillLibraryTool onShowToast={triggerToast} />}
                  {activeTool.id === 'summary-generator' && <SummaryGeneratorTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'resume-color-themes' && <ResumeColorThemesTool onShowToast={triggerToast} onNavigate={navigateTo} />}
                  {activeTool.id === 'experience-calculator' && <ExperienceCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'notice-period-calculator' && <NoticePeriodCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'salary-hike-calculator' && <SalaryHikeCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'ctc-calculator' && <CtcCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'working-days-calculator' && <WorkingDaysCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-title-generator' && <YouTubeTitleGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-description-generator' && <YouTubeDescriptionGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-tags-generator' && <YouTubeTagsGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-hashtag-generator' && <YouTubeHashtagGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-thumbnail-preview' && <YouTubeThumbnailPreviewTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-channel-name-generator' && <YouTubeChannelNameGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-video-idea-generator' && <YouTubeVideoIdeaGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-playlist-name-generator' && <YouTubePlaylistNameGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-timestamp-generator' && <YouTubeTimestampGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-description-formatter' && <YouTubeDescriptionFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'thumbnail-text-generator' && <ThumbnailTextGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'viral-hook-generator' && <ViralHookGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'cta-generator' && <CtaGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'social-character-counter' && <SocialCharacterCounterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'emoji-generator' && <EmojiGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'instagram-caption-generator' && <InstagramCaptionGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'instagram-hashtag-generator' && <InstagramHashtagGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'instagram-bio-generator' && <InstagramBioGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'instagram-username-generator' && <InstagramUsernameGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'tiktok-caption-generator' && <TikTokCaptionGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'tiktok-hashtag-generator' && <TikTokHashtagGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'facebook-caption-generator' && <FacebookCaptionGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'facebook-hashtag-generator' && <FacebookHashtagGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'linkedin-headline-generator' && <LinkedInHeadlineGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'linkedin-summary-generator' && <LinkedInSummaryGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'twitter-bio-generator' && <TwitterBioGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'universal-hashtag-generator' && <UniversalHashtagGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'fancy-text-generator' && <FancyTextGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'unicode-font-generator' && <UnicodeFontGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'text-decorator' && <TextDecoratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'emoji-combiner' && <EmojiCombinerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'social-media-post-formatter' && <SocialMediaPostFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'social-bio-link-builder' && <SocialBioLinkBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'uuid-generator' && <UuidGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'hash-generator' && <HashGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'jwt-decoder' && <JwtDecoderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'unix-timestamp-converter' && <UnixTimestampConverterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'regex-tester' && <RegexTesterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'json-formatter' && <JsonFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'json-validator' && <JsonValidatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'json-to-csv' && <JsonToCsvTool onShowToast={triggerToast} />}
                  {activeTool.id === 'csv-to-json' && <CsvToJsonTool onShowToast={triggerToast} />}
                  {activeTool.id === 'csv-viewer' && <CsvViewerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'html-formatter' && <HtmlFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'css-formatter' && <CssFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'javascript-formatter' && <JsFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'xml-formatter' && <XmlFormatterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'xml-validator' && <XmlValidatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'url-parser' && <UrlParserTool onShowToast={triggerToast} />}
                  {activeTool.id === 'url-encoder-decoder' && <UrlEncoderDecoderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'base64-encoder-decoder' && <Base64EncoderDecoderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'html-escape-unescape' && <HtmlEscapeUnescapeTool onShowToast={triggerToast} />}
                  {activeTool.id === 'http-header-viewer' && <HttpHeaderViewerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'api-request-builder' && <ApiRequestBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'color-converter' && <ColorConverterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'qr-code-decoder' && <QrCodeDecoderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'css-gradient-generator' && <CssGradientGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'box-shadow-generator' && <BoxShadowGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'border-radius-generator' && <BorderRadiusGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'glassmorphism-generator' && <GlassmorphismGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'neumorphism-generator' && <NeumorphismGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'css-clip-path-generator' && <CssClipPathGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'svg-shape-generator' && <SvgShapeGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'color-palette-generator' && <ColorPaletteGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'contrast-checker' && <ContrastCheckerTool onShowToast={triggerToast} />}
                  {activeTool.id === 'random-color-generator' && <RandomColorGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'qr-business-card-generator' && <QrBusinessCardGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'unit-converter' && <UnitConverterTool onShowToast={triggerToast} />}
                  {activeTool.id === 'percentage-calculator' && <PercentageCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'age-calculator' && <AgeCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'emi-calculator' && <EmiCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'discount-calculator' && <DiscountCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'currency-calculator' && <CurrencyCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'tip-calculator' && <TipCalculatorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'random-number-generator' && <RandomNumberGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'random-password-generator' && <RandomPasswordGeneratorTool onShowToast={triggerToast} />}
                  {activeTool.id === 'chatgpt-prompt-builder' && <ChatgptPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'gemini-prompt-builder' && <GeminiPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'claude-prompt-builder' && <ClaudePromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'veo-prompt-builder' && <VeoPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'midjourney-prompt-builder' && <MidjourneyPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'flux-prompt-builder' && <FluxPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'stable-diffusion-prompt-builder' && <StableDiffusionPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'logo-prompt-builder' && <LogoPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'thumbnail-prompt-builder' && <ThumbnailPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'product-photo-prompt-builder' && <ProductPhotoPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'interior-design-prompt-builder' && <InteriorDesignPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'story-prompt-builder' && <StoryPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'youtube-script-prompt-builder' && <YoutubeScriptPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'resume-prompt-builder' && <ResumePromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'cover-letter-prompt-builder' && <CoverLetterPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'email-prompt-builder' && <EmailPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'social-media-prompt-builder' && <SocialMediaPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'seo-prompt-builder' && <SeoPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'coding-prompt-builder' && <CodingPromptBuilderTool onShowToast={triggerToast} />}
                  {activeTool.id === 'universal-prompt-builder' && <UniversalPromptBuilderTool onShowToast={triggerToast} />}
                </Suspense>
              </div>

              {/* TOOL PAGE AD 2 */}
              <AdSlot type="native" label="Sponsored Links" />

              {/* INSTRUCTIONS / HOW TO USE */}
              <section className="glass-panel my-8 p-6 sm:p-8 rounded-3xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  {getTranslation(currentLang, 'howToUse', 'How to Use')} {activeTool.navTitle}
                </h3>
                <ol className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <li className="glass-card p-4 rounded-2xl">
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base block mb-1">1. {getTranslation(currentLang, 'uploadFiles', 'Upload Files')}</strong>
                    Drag and drop or select your files from your device.
                  </li>
                  <li className="glass-card p-4 rounded-2xl">
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base block mb-1">2. {getTranslation(currentLang, 'configureOptions', 'Configure Options')}</strong>
                    Adjust parameters like quality, ranges, or target formats.
                  </li>
                  <li className="glass-card p-4 rounded-2xl">
                    <strong className="text-indigo-600 dark:text-indigo-400 font-bold text-base block mb-1">3. {getTranslation(currentLang, 'downloadResult', 'Download Result')}</strong>
                    Save your processed files directly to your machine or download as ZIP.
                  </li>
                </ol>
              </section>

              {/* TOOL RECOMMENDATIONS */}
              <ToolRecommendations
                currentTool={activeTool}
                allTools={translatedTools}
                onNavigate={navigateTo}
              />

              {/* TOOL PAGE AD 3 */}
              <AdSlot type="banner" label="Advertisement" />
            </div>
          )}
        </main>

        {/* Search Modal */}
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelectTool={navigateTo}
        />

        {/* Keyboard Shortcuts Help Modal */}
        <KeyboardShortcutsModal
          isOpen={shortcutsOpen}
          onClose={() => setShortcutsOpen(false)}
        />

        {/* Offline & PWA Install Banner */}
        <InstallBanner />

        {/* Bottom Announcement Bar */}
        <AnnouncementBanner position="bottom" onNavigate={navigateTo} />

        {/* Footer */}
        <Footer onNavigate={navigateTo} />
      </div>
    </LanguageProvider>
  );
}
