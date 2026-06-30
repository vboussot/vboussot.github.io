/* =============================================================================
   Valentin Boussot — verified public projects.

   Repository visibility, primary language, descriptions and star counts were
   checked against GitHub on 2026-06-27. Private or empty repositories are not
   included. `topics` preserves the domain taxonomy for projects whose primary
   display category is Clinical or Challenge solutions.
   ========================================================================== */

(function () {
  "use strict";

  var projects = [
    {
      name: "KonfAI",
      description: "Modular, fully declarative PyTorch + YAML framework for medical imaging, with patching, test-time augmentation, ensembling and uncertainty estimation.",
      category: "Framework",
      url: "https://github.com/vboussot/KonfAI",
      language: "Python",
      stars: 12
    },
    {
      name: "IMPACT-Reg",
      repo: "ImpactLoss",
      description: "Generic semantic similarity and loss for multimodal registration using L1/L2 distances in pretrained segmentation feature spaces.",
      category: "Registration",
      url: "https://github.com/vboussot/ImpactLoss",
      language: "Python",
      stars: 24
    },
    {
      name: "ImpactElastix",
      description: "Elastix integration exposing IMPACT-Reg as a similarity metric for classical, algorithmic image registration.",
      category: "Registration",
      url: "https://github.com/vboussot/ImpactElastix",
      language: "C++",
      stars: 2
    },
    {
      name: "SlicerImpactReg",
      description: "3D Slicer extension for deep semantic multimodal registration with built-in quality assessment.",
      category: "Clinical (3D Slicer)",
      topics: ["Registration"],
      url: "https://github.com/vboussot/SlicerImpactReg",
      language: "Python",
      stars: 2
    },
    {
      name: "SlicerImpactSynth",
      description: "3D Slicer extension for synthetic CT generation with integrated quality assurance.",
      category: "Clinical (3D Slicer)",
      topics: ["Synthesis"],
      url: "https://github.com/vboussot/SlicerImpactSynth",
      language: "Python",
      stars: 2
    },
    {
      name: "SlicerKonfAI",
      description: "In-Slicer interface for KonfAI apps, including inference, result visualization and reference- and uncertainty-based quality assurance.",
      category: "Clinical (3D Slicer)",
      topics: ["Framework"],
      url: "https://github.com/vboussot/SlicerKonfAI",
      language: "Python",
      stars: 1
    },
    {
      name: "SlicerImpactDoseAcc",
      description: "3D Slicer extension for dose accumulation and uncertainty quantification in radiotherapy.",
      category: "Clinical (3D Slicer)",
      topics: ["Dose/RT"],
      url: "https://github.com/vboussot/SlicerImpactDoseAcc",
      language: "Python",
      stars: 3
    },
    {
      name: "Synthrad2025_Task_1",
      description: "SynthRAD 2025 Task 1 solution for synthetic CT generation from MRI and the public, reproducible form of IMPACT-Synth.",
      category: "Challenge solutions",
      topics: ["Synthesis"],
      url: "https://github.com/vboussot/Synthrad2025_Task_1",
      language: "Python",
      stars: 9,
      award: "3rd · SynthRAD 2025"
    },
    {
      name: "Synthrad2025_Task_2",
      description: "SynthRAD 2025 Task 2 solution for synthetic CT generation from CBCT.",
      category: "Challenge solutions",
      topics: ["Synthesis"],
      url: "https://github.com/vboussot/Synthrad2025_Task_2",
      language: "Python",
      stars: 3,
      award: "3rd · SynthRAD 2025"
    },
    {
      name: "Trackrad2025",
      description: "TrackRAD 2025 solution using SAM 2.1-based inference for real-time tumor tracking in cine-MRI.",
      category: "Challenge solutions",
      topics: ["Tracking"],
      url: "https://github.com/vboussot/Trackrad2025",
      language: "Python",
      stars: 2
    },
    {
      name: "CURVAS",
      description: "CURVAS abdominal multi-organ CT segmentation with voxel-wise uncertainty estimation.",
      category: "Challenge solutions",
      topics: ["Segmentation/Uncertainty"],
      url: "https://github.com/vboussot/CURVAS",
      language: "Python",
      stars: 2,
      award: "3rd · CURVAS"
    },
    {
      name: "CurvasPDACVI",
      description: "CURVAS-PDACVI solution for PDAC tumor segmentation in CT under multi-rater annotation uncertainty.",
      category: "Challenge solutions",
      topics: ["Segmentation/Uncertainty"],
      url: "https://github.com/vboussot/CurvasPDACVI",
      language: "Python",
      stars: 1,
      award: "3rd · CURVAS-PDACVI"
    },
    {
      name: "Panther",
      description: "PANTHER pancreatic tumor segmentation on T2-weighted MRI using transfer learning, fine-tuning and ensembling.",
      category: "Challenge solutions",
      topics: ["Segmentation/Uncertainty"],
      url: "https://github.com/vboussot/Panther",
      language: "Python",
      stars: 0,
      award: "2nd · PANTHER (Task 2)"
    },

    /* Hugging Face artifacts (pretrained weights + a dataset). Public visibility
       verified against the HF API on 2026-06-30. These have no GitHub language /
       star count; the host field switches the card link to the Hugging Face logo. */
    {
      name: "impact-torchscript-models",
      description: "Pretrained segmentation backbones behind the IMPACT feature space, packaged as ready-to-run TorchScript models.",
      category: "Pretrained models",
      url: "https://huggingface.co/VBoussot/impact-torchscript-models",
      host: "huggingface"
    },
    {
      name: "ImpactSynth",
      description: "Released IMPACT-Synth model weights for cross-modality CT synthesis.",
      category: "Pretrained models",
      url: "https://huggingface.co/VBoussot/ImpactSynth",
      host: "huggingface"
    },
    {
      name: "MRSegmentator-KonfAI",
      description: "Multi-organ MR segmentation model, delivered as a ready-to-run KonfAI app.",
      category: "Pretrained models",
      url: "https://huggingface.co/VBoussot/MRSegmentator-KonfAI",
      host: "huggingface"
    },
    {
      name: "synthrad2025-impact-registration",
      description: "IMPACT registration transforms (Elastix B-spline) aligning MRI and CBCT to CT, released for the SynthRAD2025 dataset.",
      category: "Dataset",
      url: "https://huggingface.co/datasets/VBoussot/synthrad2025-impact-registration",
      host: "huggingface"
    }
  ];

  window.siteContent = window.siteContent || {};
  window.siteContent.projects = projects;
})();
