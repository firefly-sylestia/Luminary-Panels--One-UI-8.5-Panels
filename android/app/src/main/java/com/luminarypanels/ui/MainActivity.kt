package com.luminarypanels.ui

import android.animation.ObjectAnimator
import android.content.SharedPreferences
import android.os.Bundle
import android.os.VibrationEffect
import android.os.Vibrator
import android.view.View
import android.view.animation.DecelerateInterpolator
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.widget.doAfterTextChanged
import com.google.android.material.button.MaterialButton
import com.google.android.material.slider.Slider
import com.google.android.material.switchmaterial.SwitchMaterial
import com.google.android.material.tabs.TabLayout
import com.google.android.material.textfield.TextInputEditText
import kotlin.math.roundToInt

class MainActivity : AppCompatActivity() {
    private lateinit var previewCard: View
    private lateinit var previewTitle: TextView
    private lateinit var previewSubtitle: TextView
    private lateinit var prefs: SharedPreferences
    private var pulseX: ObjectAnimator? = null
    private var pulseY: ObjectAnimator? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main_native)
        prefs = getSharedPreferences("native_editor_settings", MODE_PRIVATE)

        previewCard = findViewById(R.id.previewCard)
        previewTitle = findViewById(R.id.previewTitle)
        previewSubtitle = findViewById(R.id.previewSubtitle)

        setupTabs()
        bindThemeControls()
        bindTextInputs()
        bindShapeControls()
        bindTextControls()
        bindAnimationControls()
        restoreSavedState()
    }

    private fun setupTabs() {
        val tabs = findViewById<TabLayout>(R.id.nativeTabs)
        if (tabs.tabCount == 0) {
            listOf("Assets", "Layout", "Avatar", "Text").forEach { tabs.addTab(tabs.newTab().setText(it)) }
        }
    }

    private fun bindThemeControls() {
        findViewById<MaterialButton>(R.id.themeAurora).setOnClickListener { applyTheme("aurora") }
        findViewById<MaterialButton>(R.id.themeRose).setOnClickListener { applyTheme("rose") }
        findViewById<MaterialButton>(R.id.themeArctic).setOnClickListener { applyTheme("arctic") }
    }

    private fun applyTheme(theme: String) {
        when (theme) {
            "aurora" -> previewCard.setBackgroundResource(R.drawable.preview_card_bg)
            "rose" -> previewCard.setBackgroundColor(ContextCompat.getColor(this, android.R.color.holo_red_dark))
            "arctic" -> previewCard.setBackgroundColor(ContextCompat.getColor(this, android.R.color.holo_blue_dark))
        }
        prefs.edit().putString("theme", theme).apply()
    }

    private fun bindTextInputs() {
        val inputTitle = findViewById<TextInputEditText>(R.id.inputTitle)
        val inputSubtitle = findViewById<TextInputEditText>(R.id.inputSubtitle)
        val autoSave = findViewById<SwitchMaterial>(R.id.switchAutoSave)

        inputTitle.doAfterTextChanged {
            previewTitle.text = it?.toString().orEmpty().ifBlank { "Luminary Panels" }
            maybeSave(autoSave.isChecked)
        }
        inputSubtitle.doAfterTextChanged {
            previewSubtitle.text = it?.toString().orEmpty().ifBlank { "Native Android Editor" }
            maybeSave(autoSave.isChecked)
        }
    }

    private fun bindShapeControls() {
        val widthSlider = findViewById<Slider>(R.id.sliderWidth)
        val heightSlider = findViewById<Slider>(R.id.sliderHeight)
        val radiusSlider = findViewById<Slider>(R.id.sliderRadius)
        val autoSave = findViewById<SwitchMaterial>(R.id.switchAutoSave)

        val applyShape = {
            previewCard.layoutParams = previewCard.layoutParams.apply {
                width = widthSlider.value.roundToInt()
                height = heightSlider.value.roundToInt()
            }
            previewCard.clipToOutline = true
            previewCard.outlineProvider = RoundedOutlineProvider(radiusSlider.value)
            previewCard.requestLayout()
            maybeSave(autoSave.isChecked)
        }
        widthSlider.addOnChangeListener { _, _, _ -> applyShape() }
        heightSlider.addOnChangeListener { _, _, _ -> applyShape() }
        radiusSlider.addOnChangeListener { _, _, _ -> applyShape() }
        applyShape()
    }

    private fun bindTextControls() {
        val textSizeSlider = findViewById<Slider>(R.id.sliderTextSize)
        val opacitySlider = findViewById<Slider>(R.id.sliderOpacity)
        val autoSave = findViewById<SwitchMaterial>(R.id.switchAutoSave)

        textSizeSlider.addOnChangeListener { _, value, _ ->
            previewTitle.textSize = value
            maybeSave(autoSave.isChecked)
        }
        opacitySlider.addOnChangeListener { _, value, _ ->
            val alpha = value / 100f
            previewTitle.alpha = alpha
            previewSubtitle.alpha = alpha
            maybeSave(autoSave.isChecked)
        }
    }

    private fun bindAnimationControls() {
        val motionSlider = findViewById<Slider>(R.id.sliderMotion)
        val pulseToggle = findViewById<SwitchMaterial>(R.id.switchPulse)
        val autoSave = findViewById<SwitchMaterial>(R.id.switchAutoSave)
        val haptics = findViewById<SwitchMaterial>(R.id.switchHaptics)

        motionSlider.addOnChangeListener { _, value, fromUser ->
            previewCard.translationX = value * 12f
            previewCard.translationY = value * -6f
            if (fromUser && haptics.isChecked) vibrateTick()
            maybeSave(autoSave.isChecked)
        }

        pulseToggle.setOnCheckedChangeListener { _, isChecked ->
            if (isChecked) startPulse() else stopPulse()
            maybeSave(autoSave.isChecked)
        }
    }

    private fun vibrateTick() {
        val vibrator = getSystemService(VIBRATOR_SERVICE) as Vibrator
        vibrator.vibrate(VibrationEffect.createOneShot(16, VibrationEffect.DEFAULT_AMPLITUDE))
    }

    private fun startPulse() {
        stopPulse()
        pulseX = ObjectAnimator.ofFloat(previewCard, View.SCALE_X, 1f, 1.035f, 1f).apply {
            duration = 1400; repeatCount = ObjectAnimator.INFINITE; interpolator = DecelerateInterpolator(); start()
        }
        pulseY = ObjectAnimator.ofFloat(previewCard, View.SCALE_Y, 1f, 1.035f, 1f).apply {
            duration = 1400; repeatCount = ObjectAnimator.INFINITE; interpolator = DecelerateInterpolator(); start()
        }
    }

    private fun stopPulse() {
        pulseX?.cancel(); pulseY?.cancel()
        previewCard.animate().scaleX(1f).scaleY(1f).setDuration(220).start()
    }

    private fun maybeSave(enabled: Boolean) {
        if (!enabled) return
        prefs.edit().putString("title", previewTitle.text.toString()).putString("subtitle", previewSubtitle.text.toString())
            .putFloat("width", findViewById<Slider>(R.id.sliderWidth).value)
            .putFloat("height", findViewById<Slider>(R.id.sliderHeight).value)
            .putFloat("radius", findViewById<Slider>(R.id.sliderRadius).value)
            .putFloat("textSize", findViewById<Slider>(R.id.sliderTextSize).value)
            .putFloat("opacity", findViewById<Slider>(R.id.sliderOpacity).value)
            .putFloat("motion", findViewById<Slider>(R.id.sliderMotion).value)
            .putBoolean("pulse", findViewById<SwitchMaterial>(R.id.switchPulse).isChecked)
            .putBoolean("haptics", findViewById<SwitchMaterial>(R.id.switchHaptics).isChecked)
            .apply()
    }

    private fun restoreSavedState() {
        findViewById<TextInputEditText>(R.id.inputTitle).setText(prefs.getString("title", "Luminary Panels"))
        findViewById<TextInputEditText>(R.id.inputSubtitle).setText(prefs.getString("subtitle", "Native Android Editor"))
        findViewById<Slider>(R.id.sliderWidth).value = prefs.getFloat("width", 320f)
        findViewById<Slider>(R.id.sliderHeight).value = prefs.getFloat("height", 140f)
        findViewById<Slider>(R.id.sliderRadius).value = prefs.getFloat("radius", 60f)
        findViewById<Slider>(R.id.sliderTextSize).value = prefs.getFloat("textSize", 24f)
        findViewById<Slider>(R.id.sliderOpacity).value = prefs.getFloat("opacity", 100f)
        findViewById<Slider>(R.id.sliderMotion).value = prefs.getFloat("motion", 0f)
        findViewById<SwitchMaterial>(R.id.switchPulse).isChecked = prefs.getBoolean("pulse", false)
        findViewById<SwitchMaterial>(R.id.switchHaptics).isChecked = prefs.getBoolean("haptics", false)
        applyTheme(prefs.getString("theme", "aurora").orEmpty())
    }
}
